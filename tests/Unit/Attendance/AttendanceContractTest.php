<?php

use App\Modules\Attendance\DTOs\AttendanceCommand;
use App\Modules\Attendance\DTOs\AttendanceResult;
use App\Modules\Attendance\Enums\AttendanceRejectionReason;
use App\Modules\Attendance\Enums\AttendanceSource;
use App\Modules\Attendance\Events\AttendanceCheckedIn;
use App\Modules\Attendance\Events\AttendanceRejected;

it('fingerprints every idempotency-sensitive command field without exposing the QR token', function () {
    $base = new AttendanceCommand(
        requestId: '331e1435-3356-454c-87ae-19e036bd5708',
        source: AttendanceSource::PhoneCamera,
        actorId: 12,
        qrToken: 'private-qr-token',
        deviceId: 'device-one',
    );
    $changed = new AttendanceCommand(
        requestId: $base->requestId,
        source: AttendanceSource::PhoneCamera,
        actorId: 12,
        qrToken: 'private-qr-token',
        deviceId: 'device-two',
    );

    expect($base->fingerprint())->toHaveLength(64)
        ->not->toContain('private-qr-token')
        ->and($base->fingerprint())->not->toBe($changed->fingerprint());
});

it('serializes accepted and rejected attendance results to the stable safe contract', function () {
    $accepted = new AttendanceResult(
        accepted: true,
        result: 'checked_in',
        attendanceRecordId: 100,
        member: ['id' => 5, 'member_number' => 'MEM-5', 'display_name' => 'Test Member'],
        occurredAt: '2026-07-24T10:00:00+05:30',
    );
    $rejected = new AttendanceResult(
        accepted: false,
        result: 'rejected',
        reason: AttendanceRejectionReason::InvalidQr,
    );

    expect($accepted->toArray())->toMatchArray([
        'result' => 'checked_in',
        'attendance_record_id' => 100,
        'checked_in_at' => '2026-07-24T10:00:00+05:30',
        'replayed' => false,
        'override_applied' => false,
    ])->not->toHaveKey('occurred_at')
        ->and($rejected->toArray())->toMatchArray([
            'result' => 'rejected',
            'reason_code' => 'invalid_qr',
        ]);
});

it('keeps published event payloads scalar and free of credentials and free-text override notes', function () {
    $checkedIn = new AttendanceCheckedIn(
        eventId: '90d51c92-5419-46a4-8eec-ee8bb67d013e',
        tenantId: 1,
        branchId: 2,
        attendanceRecordId: 3,
        memberId: 4,
        membershipId: 5,
        actorId: 6,
        deviceId: 'scanner',
        source: 'phone_camera',
        result: 'checked_in',
        occurredAt: '2026-07-24T10:00:00+05:30',
        overrideApplied: false,
    );
    $rejected = new AttendanceRejected(
        eventId: '90d51c92-5419-46a4-8eec-ee8bb67d013e',
        tenantId: 1,
        branchId: 2,
        memberId: null,
        membershipId: null,
        actorId: 6,
        deviceId: 'scanner',
        source: 'phone_camera',
        result: 'rejected',
        reasonCode: 'invalid_qr',
        occurredAt: '2026-07-24T10:00:00+05:30',
        overrideApplied: false,
    );

    foreach ([$checkedIn, $rejected] as $event) {
        $payload = get_object_vars($event);
        foreach ($payload as $value) {
            expect(is_scalar($value) || $value === null)->toBeTrue();
        }
        expect(array_keys($payload))
            ->not->toContain('qrToken', 'token', 'tokenHash', 'reason', 'member', 'membership');
    }
});
