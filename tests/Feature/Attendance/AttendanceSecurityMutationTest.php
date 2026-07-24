<?php

use App\Models\Branch;
use App\Models\Member;
use App\Models\Tenant;
use App\Modules\Attendance\Models\AttendanceCorrection;
use App\Modules\Attendance\Models\AttendanceRecord;
use App\Modules\Attendance\Models\AttendanceScanLog;
use App\Modules\Membership\Models\Membership;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;

require_once __DIR__.'/AttendanceTestHelpers.php';

uses(RefreshDatabase::class);

function checkedInAttendanceFixture(object $test): array
{
    $fixture = attendanceFixture();
    $token = attendanceQrToken($test, $fixture);
    attendanceScan($test, $fixture, $token)->assertOk();
    $fixture['record'] = AttendanceRecord::query()->sole();

    return $fixture;
}

it('keeps correction and reversal history append only and auditable', function () {
    $fixture = checkedInAttendanceFixture($this);
    $record = $fixture['record'];
    $correctedAt = now()->subMinutes(10)->toIso8601String();

    attendancePost(
        $this,
        $fixture,
        "/api/v1/attendance/records/{$record->id}/corrections",
        [
            'request_id' => 'a334d159-c3a3-4ce8-ae11-5de1d5d120f6',
            'reason' => 'Correcting the check-in time from the desk log.',
            'checked_in_at' => $correctedAt,
        ],
    )->assertOk()->assertJsonCount(1, 'data.corrections');

    $correction = AttendanceCorrection::query()->sole();
    expect($correction->before_values['checked_in_at'])
        ->not->toBe($correction->after_values['checked_in_at']);
    expect(fn () => $correction->update(['reason' => 'changed']))
        ->toThrow(LogicException::class, 'append-only');
    expect(fn () => $correction->delete())
        ->toThrow(LogicException::class, 'append-only');

    attendancePost(
        $this,
        $fixture,
        "/api/v1/attendance/records/{$record->id}/reversal",
        [
            'request_id' => 'db5283dd-3628-4b70-87db-05f9eb50b7c0',
            'reason' => 'Entry was recorded for the wrong member.',
        ],
    )->assertOk()->assertJsonPath('data.status', 'reversed');

    expect(AttendanceCorrection::query()->count())->toBe(2);
    expect(fn () => $record->refresh()->delete())
        ->toThrow(LogicException::class, 'cannot be deleted');
    $this->assertDatabaseHas('audit_logs', [
        'action' => 'attendance.corrected',
        'auditable_id' => $record->id,
    ]);
    $this->assertDatabaseHas('audit_logs', [
        'action' => 'attendance.reversed',
        'auditable_id' => $record->id,
    ]);
});

it('makes correction requests idempotent and rejects changed payload reuse', function () {
    $fixture = checkedInAttendanceFixture($this);
    $record = $fixture['record'];
    $requestId = '88a949fd-7fc9-492d-9f6a-25361fe8fecc';
    $payload = [
        'request_id' => $requestId,
        'reason' => 'Clock correction',
        'checked_in_at' => now()->subMinutes(5)->toIso8601String(),
    ];

    attendancePost(
        $this,
        $fixture,
        "/api/v1/attendance/records/{$record->id}/corrections",
        $payload,
    )->assertOk();
    attendancePost(
        $this,
        $fixture,
        "/api/v1/attendance/records/{$record->id}/corrections",
        $payload,
    )->assertOk();
    attendancePost(
        $this,
        $fixture,
        "/api/v1/attendance/records/{$record->id}/corrections",
        [...$payload, 'reason' => 'Different correction'],
    )->assertConflict()->assertJsonPath(
        'message',
        'The idempotency key was already used for a different attendance change.',
    );

    expect(AttendanceCorrection::query()->count())->toBe(1);
});

it('validates corrections and prevents impossible timestamps', function () {
    $fixture = checkedInAttendanceFixture($this);
    $record = $fixture['record'];

    attendancePost(
        $this,
        $fixture,
        "/api/v1/attendance/records/{$record->id}/corrections",
        ['request_id' => fake()->uuid(), 'reason' => 'No timestamps'],
    )->assertUnprocessable()->assertJsonValidationErrors('timestamps');

    attendancePost(
        $this,
        $fixture,
        "/api/v1/attendance/records/{$record->id}/corrections",
        [
            'request_id' => fake()->uuid(),
            'reason' => 'Invalid ordering',
            'checked_in_at' => now()->toIso8601String(),
            'checked_out_at' => now()->subHour()->toIso8601String(),
        ],
    )->assertUnprocessable()->assertJsonPath('message', 'Check-out time cannot be before check-in time.');
});

it('enforces exact permissions and assigned branch scope', function () {
    $fixture = checkedInAttendanceFixture($this);
    $record = $fixture['record'];
    $unauthorized = attendanceUser($fixture['tenant'], $fixture['branch']);

    $this->actingAs($unauthorized)
        ->withHeader('X-Branch-Id', (string) $fixture['branch']->id)
        ->getJson('/api/v1/attendance/records')
        ->assertForbidden();

    $historyUser = attendanceUser(
        $fixture['tenant'],
        $fixture['branch'],
        ['attendance.history.view'],
    );
    $this->actingAs($historyUser)
        ->withHeader('X-Branch-Id', (string) $fixture['branch']->id)
        ->getJson("/api/v1/attendance/records/{$record->id}")
        ->assertOk();

    $otherBranch = Branch::factory()->for($fixture['tenant'])->create();
    $otherBranchUser = attendanceUser(
        $fixture['tenant'],
        $otherBranch,
        ['attendance.history.view'],
    );
    $this->actingAs($otherBranchUser)
        ->withHeader('X-Branch-Id', (string) $otherBranch->id)
        ->getJson("/api/v1/attendance/records/{$record->id}")
        ->assertNotFound();
});

it('protects route model binding and QR records across tenants', function () {
    $fixture = checkedInAttendanceFixture($this);
    $record = $fixture['record'];
    $otherTenant = Tenant::factory()->create();
    $otherBranch = Branch::factory()->for($otherTenant)->create();
    $otherOwner = attendanceUser($otherTenant, $otherBranch, owner: true);

    $this->actingAs($otherOwner)
        ->withHeader('X-Branch-Id', (string) $otherBranch->id)
        ->getJson("/api/v1/attendance/records/{$record->id}")
        ->assertNotFound();

    $this->actingAs($otherOwner)
        ->withHeader('X-Branch-Id', (string) $otherBranch->id)
        ->postJson('/api/v1/attendance/qr/rotate', ['member_id' => $fixture['member']->id])
        ->assertNotFound();
});

it('returns accurate bounded live attendance and paginated branch history', function () {
    $fixture = checkedInAttendanceFixture($this);
    $otherMember = Member::factory()->for($fixture['tenant'])->create([
        'branch_id' => $fixture['branch']->id,
    ]);
    $otherMembership = Membership::factory()->for($fixture['tenant'])->create([
        'branch_id' => $fixture['branch']->id,
        'member_id' => $otherMember->id,
        'plan_id' => $fixture['plan']->id,
    ]);
    AttendanceRecord::query()->create([
        'tenant_id' => $fixture['tenant']->id,
        'branch_id' => $fixture['branch']->id,
        'member_id' => $otherMember->id,
        'membership_id' => $otherMembership->id,
        'request_id' => fake()->uuid(),
        'status' => 'checked_in',
        'source' => 'manual',
        'checked_in_at' => CarbonImmutable::now($fixture['tenant']->timezone),
        'recorded_by' => $fixture['user']->id,
    ]);

    $this->actingAs($fixture['user'])
        ->withHeader('X-Branch-Id', (string) $fixture['branch']->id)
        ->getJson('/api/v1/attendance/live')
        ->assertOk()
        ->assertJsonPath('data.count', 2)
        ->assertJsonPath('data.truncated', false)
        ->assertJsonCount(2, 'data.records');

    $this->actingAs($fixture['user'])
        ->withHeader('X-Branch-Id', (string) $fixture['branch']->id)
        ->getJson('/api/v1/attendance/records?per_page=1')
        ->assertOk()
        ->assertJsonPath('meta.per_page', 1)
        ->assertJsonPath('meta.total', 2)
        ->assertJsonCount(1, 'data');

    $this->actingAs($fixture['user'])
        ->withHeader('X-Branch-Id', (string) $fixture['branch']->id)
        ->getJson('/api/v1/attendance/records?per_page=101')
        ->assertUnprocessable();
});

it('limits recent scan results to the acting staff member and device', function () {
    $fixture = attendanceFixture();
    $token = attendanceQrToken($this, $fixture);
    attendanceScan($this, $fixture, $token, ['device_id' => 'device-a'])->assertOk();

    $otherScanner = attendanceUser(
        $fixture['tenant'],
        $fixture['branch'],
        ['attendance.scan'],
    );
    $this->actingAs($otherScanner)
        ->withHeader('X-Branch-Id', (string) $fixture['branch']->id)
        ->getJson('/api/v1/attendance/scans/recent?device_id=device-a')
        ->assertOk()
        ->assertJsonCount(0, 'data');

    $this->actingAs($fixture['user'])
        ->withHeader('X-Branch-Id', (string) $fixture['branch']->id)
        ->getJson('/api/v1/attendance/scans/recent?device_id=device-a')
        ->assertOk()
        ->assertJsonCount(1, 'data');
});

it('rate limits scans with the safe rejection contract', function () {
    RateLimiter::clear('');
    $fixture = attendanceFixture();

    foreach (range(1, 30) as $attempt) {
        attendanceScan($this, $fixture, 'invalid-token', [
            'request_id' => fake()->uuid(),
            'device_id' => 'rate-limited-device',
        ])->assertUnprocessable();
    }

    attendanceScan($this, $fixture, 'invalid-token', [
        'request_id' => fake()->uuid(),
        'device_id' => 'rate-limited-device',
    ])->assertTooManyRequests()
        ->assertJsonPath('errors.reason_code.0', 'rate_limit_exceeded')
        ->assertHeader('Retry-After');
});

it('validates and audits branch attendance settings', function () {
    $fixture = attendanceFixture();

    $this->actingAs($fixture['user'])
        ->withHeader('X-Branch-Id', (string) $fixture['branch']->id)
        ->putJson('/api/v1/attendance/settings', [
            'mode' => 'check_in_out',
            'duplicate_window_seconds' => 90,
            'allow_manual_entry' => true,
            'manager_override_required' => true,
            'visit_limit_rules' => ['visits_per_day' => 2],
        ])->assertOk()
        ->assertJsonPath('data.mode', 'check_in_out')
        ->assertJsonPath('data.visit_limit_rules.visits_per_day', 2);

    $this->assertDatabaseHas('attendance_settings', [
        'tenant_id' => $fixture['tenant']->id,
        'branch_id' => $fixture['branch']->id,
        'duplicate_window_seconds' => 90,
    ]);
    $this->assertDatabaseHas('audit_logs', ['action' => 'attendance.settings.updated']);

    $this->actingAs($fixture['user'])
        ->withHeader('X-Branch-Id', (string) $fixture['branch']->id)
        ->putJson('/api/v1/attendance/settings', [
            'mode' => 'invalid',
            'duplicate_window_seconds' => 1,
            'allow_manual_entry' => true,
            'manager_override_required' => true,
        ])->assertUnprocessable()
        ->assertJsonValidationErrors(['mode', 'duplicate_window_seconds']);
});

it('keeps scan logs append only', function () {
    $fixture = checkedInAttendanceFixture($this);
    $log = AttendanceScanLog::query()->sole();

    expect(fn () => $log->update(['reason' => 'changed']))
        ->toThrow(LogicException::class, 'append-only');
    expect(fn () => $log->delete())
        ->toThrow(LogicException::class, 'append-only');
});
