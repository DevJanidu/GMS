<?php

use App\Enums\MemberStatus;
use App\Modules\Attendance\Events\AttendanceCheckedIn;
use App\Modules\Attendance\Events\AttendanceCheckedOut;
use App\Modules\Attendance\Events\AttendanceOverrideApplied;
use App\Modules\Attendance\Events\AttendanceRejected;
use App\Modules\Attendance\Models\AttendanceRecord;
use App\Modules\Attendance\Models\AttendanceScanLog;
use App\Modules\Attendance\Models\AttendanceSetting;
use App\Modules\Attendance\Models\MemberQrCredential;
use App\Modules\Membership\Enums\MembershipStatus;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;

require_once __DIR__.'/AttendanceTestHelpers.php';

uses(RefreshDatabase::class);

it('checks in with a secure QR and records safe attribution', function () {
    Event::fake();
    $fixture = attendanceFixture();
    $token = attendanceQrToken($this, $fixture);

    attendanceScan($this, $fixture, $token, [
        'request_id' => '7a766657-7548-42c5-9599-6324d9b8b810',
        'device_id' => 'front-desk-phone',
    ])->assertOk()
        ->assertJsonPath('data.result', 'checked_in')
        ->assertJsonPath('data.member.id', $fixture['member']->id)
        ->assertJsonPath('data.replayed', false)
        ->assertJsonPath('data.override_applied', false)
        ->assertJsonStructure(['data' => ['checked_in_at']]);

    $record = AttendanceRecord::query()->sole();
    expect($record->tenant_id)->toBe($fixture['tenant']->id)
        ->and($record->branch_id)->toBe($fixture['branch']->id)
        ->and($record->member_id)->toBe($fixture['member']->id)
        ->and($record->membership_id)->toBe($fixture['membership']->id)
        ->and($record->recorded_by)->toBe($fixture['user']->id)
        ->and($record->device_id)->toBe('front-desk-phone')
        ->and($record->request_hash)->toHaveLength(64);

    expect(MemberQrCredential::query()->sole()->token_hash)
        ->toBe(hash('sha256', $token))
        ->not->toBe($token);

    Event::assertDispatched(AttendanceCheckedIn::class, function (AttendanceCheckedIn $event) use ($record) {
        $payload = get_object_vars($event);

        return $event->attendanceRecordId === $record->id
            && $event->result === 'checked_in'
            && $event->source === 'phone_camera'
            && ! array_key_exists('qrToken', $payload)
            && ! str_contains(json_encode($payload, JSON_THROW_ON_ERROR), 'gms-attendance');
    });
});

it('only dispatches domain events after the attendance transaction actually commits', function () {
    Event::fake();
    $fixture = attendanceFixture();
    $token = attendanceQrToken($this, $fixture);

    DB::beginTransaction();
    attendanceScan($this, $fixture, $token)->assertOk();
    Event::assertNotDispatched(AttendanceCheckedIn::class);
    DB::rollBack();

    Event::assertNotDispatched(AttendanceCheckedIn::class);
    expect(AttendanceRecord::query()->count())->toBe(0)
        ->and(AttendanceScanLog::query()->count())->toBe(0);
});

it('rejects invalid tampered revoked and expired QR credentials safely', function () {
    Event::fake();
    $fixture = attendanceFixture();
    $token = attendanceQrToken($this, $fixture);

    attendanceScan($this, $fixture, 'not-a-credential')
        ->assertUnprocessable()
        ->assertJsonPath('errors.reason_code.0', 'invalid_qr');

    attendanceScan($this, $fixture, $token.'tampered')
        ->assertUnprocessable()
        ->assertJsonPath('errors.reason_code.0', 'invalid_qr');

    attendancePost($this, $fixture, "/api/v1/attendance/members/{$fixture['member']->id}/qr", [])
        ->assertMethodNotAllowed();
    $this->actingAs($fixture['user'])
        ->withHeader('X-Branch-Id', (string) $fixture['branch']->id)
        ->deleteJson("/api/v1/attendance/members/{$fixture['member']->id}/qr")
        ->assertOk();
    attendanceScan($this, $fixture, $token)
        ->assertUnprocessable()
        ->assertJsonPath('errors.reason_code.0', 'invalid_qr');

    $expired = attendanceQrToken($this, $fixture);
    MemberQrCredential::query()->whereNull('revoked_at')->update(['expires_at' => now()->subMinute()]);
    attendanceScan($this, $fixture, $expired)
        ->assertUnprocessable()
        ->assertJsonPath('errors.reason_code.0', 'invalid_qr');

    expect(AttendanceRecord::query()->count())->toBe(0);
    Event::assertDispatched(AttendanceRejected::class, fn (AttendanceRejected $event) => $event->reasonCode === 'invalid_qr'
        && $event->result === 'rejected'
        && $event->overrideApplied === false
    );
});

it('rotates QR credentials without exposing their stored hash', function () {
    $fixture = attendanceFixture();
    $first = attendanceQrToken($this, $fixture);
    $second = attendanceQrToken($this, $fixture);

    expect($first)->not->toBe($second)
        ->and(MemberQrCredential::query()->count())->toBe(2)
        ->and(MemberQrCredential::query()->whereNotNull('revoked_at')->count())->toBe(1);

    attendanceScan($this, $fixture, $first)
        ->assertUnprocessable()
        ->assertJsonPath('errors.reason_code.0', 'invalid_qr');
    attendanceScan($this, $fixture, $second)->assertOk();

    $this->assertDatabaseHas('audit_logs', [
        'action' => 'attendance.qr.rotated',
        'auditable_id' => $fixture['member']->id,
    ]);
});

it('rejects inactive members and missing or unavailable memberships with stable reasons', function (
    array $memberAttributes,
    ?array $membershipAttributes,
    string $reason,
) {
    $fixture = attendanceFixture($memberAttributes, [], $membershipAttributes ?? []);
    if ($membershipAttributes === null) {
        DB::table('memberships')->where('id', $fixture['membership']->id)->delete();
    }
    $token = attendanceQrToken($this, $fixture);

    attendanceScan($this, $fixture, $token)
        ->assertUnprocessable()
        ->assertJsonPath('errors.reason_code.0', $reason)
        ->assertJsonMissingPath('exception');
})->with([
    'inactive member' => [['status' => MemberStatus::Inactive], [], 'member_inactive'],
    'missing membership' => [[], null, 'membership_not_found'],
    'pending membership' => [[], [
        'status' => MembershipStatus::Pending,
        'starts_on' => now()->addWeek()->toDateString(),
    ], 'membership_not_active'],
    'expired membership' => [[], [
        'status' => MembershipStatus::Expired,
        'grace_ends_on' => now()->subDay()->toDateString(),
    ], 'membership_expired'],
    'frozen membership' => [[], ['status' => MembershipStatus::Frozen], 'membership_frozen'],
    'suspended membership' => [[], ['status' => MembershipStatus::Suspended], 'membership_suspended'],
]);

it('enforces plan branch and visit-limit rules', function () {
    $fixture = attendanceFixture([], [], [
        'plan_access_rules_snapshot' => ['gym_access' => false],
    ]);
    $token = attendanceQrToken($this, $fixture);
    attendanceScan($this, $fixture, $token)
        ->assertUnprocessable()
        ->assertJsonPath('errors.reason_code.0', 'plan_access_denied');

    $fixture['membership']->update([
        'plan_access_rules_snapshot' => ['allowed_branch_ids' => [999999]],
    ]);
    attendanceScan($this, $fixture, $token)
        ->assertUnprocessable()
        ->assertJsonPath('errors.reason_code.0', 'branch_not_allowed');

    $fixture['membership']->update([
        'plan_access_rules_snapshot' => ['visits_per_day' => 1],
    ]);
    AttendanceRecord::query()->create([
        'tenant_id' => $fixture['tenant']->id,
        'branch_id' => $fixture['branch']->id,
        'member_id' => $fixture['member']->id,
        'membership_id' => $fixture['membership']->id,
        'request_id' => fake()->uuid(),
        'status' => 'checked_out',
        'source' => 'manual',
        'checked_in_at' => CarbonImmutable::now($fixture['tenant']->timezone)->subHours(2),
        'checked_out_at' => CarbonImmutable::now($fixture['tenant']->timezone)->subHour(),
        'recorded_by' => $fixture['user']->id,
    ]);
    attendanceScan($this, $fixture, $token)
        ->assertUnprocessable()
        ->assertJsonPath('errors.reason_code.0', 'visit_limit_reached');
});

it('replays an identical request and rejects a changed payload for the same key', function () {
    $fixture = attendanceFixture();
    $token = attendanceQrToken($this, $fixture);
    $requestId = 'a8aa8f87-a32a-46ca-b754-7552977b9368';
    $payload = ['request_id' => $requestId, 'device_id' => 'same-device'];

    attendanceScan($this, $fixture, $token, $payload)
        ->assertOk()
        ->assertJsonPath('data.replayed', false);
    attendanceScan($this, $fixture, $token, $payload)
        ->assertOk()
        ->assertJsonPath('data.replayed', true);
    attendanceScan($this, $fixture, $token, [...$payload, 'device_id' => 'changed-device'])
        ->assertConflict()
        ->assertJsonPath('errors.reason_code.0', 'duplicate_request');

    expect(AttendanceRecord::query()->count())->toBe(1)
        ->and(AttendanceScanLog::query()->count())->toBe(1);
});

it('blocks a duplicate scan with a different request inside the configured window', function () {
    $fixture = attendanceFixture();
    $token = attendanceQrToken($this, $fixture);

    attendanceScan($this, $fixture, $token)->assertOk();
    attendanceScan($this, $fixture, $token)
        ->assertUnprocessable()
        ->assertJsonPath('errors.reason_code.0', 'already_checked_in');

    expect(AttendanceRecord::query()->count())->toBe(1)
        ->and(AttendanceScanLog::query()->count())->toBe(2);
});

it('supports explicit checkout only in check-in and checkout mode', function () {
    Event::fake();
    $fixture = attendanceFixture();
    $token = attendanceQrToken($this, $fixture);

    attendanceScan($this, $fixture, $token)->assertOk();
    $record = AttendanceRecord::query()->sole();
    attendancePost(
        $this,
        $fixture,
        "/api/v1/attendance/records/{$record->id}/checkout",
        ['request_id' => fake()->uuid(), 'reason' => 'Member departed'],
    )->assertUnprocessable()->assertJsonPath('message', 'Check-out is disabled for this branch.');

    AttendanceSetting::query()->where('branch_id', $fixture['branch']->id)->update([
        'mode' => 'check_in_out',
    ]);
    attendanceScan($this, $fixture, $token, ['action' => 'check_out'])
        ->assertOk()
        ->assertJsonPath('data.result', 'checked_out')
        ->assertJsonStructure(['data' => ['checked_out_at']]);

    expect($record->refresh()->checked_out_at)->not->toBeNull();
    Event::assertDispatched(AttendanceCheckedOut::class);
});

it('requires override permission and reason and writes an audit record', function () {
    Event::fake();
    $fixture = attendanceFixture([], [], [
        'status' => MembershipStatus::Expired,
        'grace_ends_on' => now()->subDay()->toDateString(),
    ]);
    $token = attendanceQrToken($this, $fixture);
    $staff = attendanceUser($fixture['tenant'], $fixture['branch'], ['attendance.scan']);

    $this->actingAs($staff)
        ->withHeader('X-Branch-Id', (string) $fixture['branch']->id)
        ->postJson('/api/v1/attendance/scans', [
            'qr_token' => $token,
            'request_id' => fake()->uuid(),
            'source' => 'phone_camera',
            'override' => true,
            'override_reason' => 'Approved exception',
        ])->assertForbidden();

    attendanceScan($this, $fixture, $token, ['override' => true])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('override_reason');

    attendanceScan($this, $fixture, $token, [
        'override' => true,
        'override_reason' => 'Manager approved a one-time access exception.',
    ])->assertOk()
        ->assertJsonPath('data.override_applied', true);

    $record = AttendanceRecord::query()->sole();
    expect($record->override_by)->toBe($fixture['user']->id)
        ->and($record->override_reason)->toBe('Manager approved a one-time access exception.');
    $this->assertDatabaseHas('audit_logs', [
        'action' => 'attendance.override.applied',
        'auditable_id' => $record->id,
    ]);
    Event::assertDispatched(AttendanceOverrideApplied::class, fn (AttendanceOverrideApplied $event) => $event->reasonCode === 'membership_expired'
        && $event->overrideApplied
        && ! property_exists($event, 'reason')
    );
});

it('rejects manual attendance when disabled and attributes accepted manual actions', function () {
    $fixture = attendanceFixture();
    AttendanceSetting::query()->create([
        'tenant_id' => $fixture['tenant']->id,
        'branch_id' => $fixture['branch']->id,
        'mode' => 'check_in_only',
        'duplicate_window_seconds' => 60,
        'allow_manual_entry' => false,
        'manager_override_required' => true,
    ]);

    $payload = [
        'member_id' => $fixture['member']->id,
        'request_id' => fake()->uuid(),
        'device_id' => 'reception-desk',
    ];
    attendancePost($this, $fixture, '/api/v1/attendance/manual', $payload)->assertForbidden();

    AttendanceSetting::query()->update(['allow_manual_entry' => true]);
    attendancePost($this, $fixture, '/api/v1/attendance/manual', $payload)
        ->assertOk()
        ->assertJsonPath('data.result', 'checked_in');

    $record = AttendanceRecord::query()->sole();
    expect($record->source->value)->toBe('manual')
        ->and($record->device_id)->toBe('reception-desk')
        ->and($record->recorded_by)->toBe($fixture['user']->id);
});
