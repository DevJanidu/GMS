<?php

namespace App\Modules\Attendance\Services;

use App\Models\User;
use App\Modules\AccessControl\Services\AuditLogger;
use App\Modules\Attendance\Enums\AttendanceMode;
use App\Modules\Attendance\Enums\AttendanceStatus;
use App\Modules\Attendance\Events\AttendanceCheckedOut;
use App\Modules\Attendance\Events\AttendanceCorrected;
use App\Modules\Attendance\Events\AttendanceReversed;
use App\Modules\Attendance\Models\AttendanceCorrection;
use App\Modules\Attendance\Models\AttendanceRecord;
use DomainException;
use Illuminate\Support\Facades\DB;

class AttendanceRecordMutationService
{
    public function __construct(
        private readonly AttendanceSettingsService $settings,
        private readonly AuditLogger $audit,
    ) {}

    public function checkout(
        AttendanceRecord $record,
        string $requestId,
        int $actorId,
        ?string $reason = null,
    ): AttendanceRecord {
        $hash = $this->hash(['operation' => 'checkout', 'record_id' => $record->id, 'reason' => $reason]);

        return DB::transaction(function () use ($record, $requestId, $actorId, $reason, $hash): AttendanceRecord {
            if ($existing = $this->existing($requestId, $hash)) {
                return $existing->attendanceRecord;
            }

            $locked = AttendanceRecord::query()->lockForUpdate()->findOrFail($record->id);
            if ($existing = $this->existing($requestId, $hash)) {
                return $existing->attendanceRecord;
            }
            if ($this->settings->forBranch($locked->branch_id)->mode !== AttendanceMode::CheckInOut) {
                throw new DomainException('Check-out is disabled for this branch.');
            }
            if ($locked->status !== AttendanceStatus::CheckedIn || $locked->checked_out_at) {
                throw new DomainException('This attendance record is not currently checked in.');
            }

            $before = $this->snapshot($locked);
            $locked->status = AttendanceStatus::CheckedOut;
            $locked->checked_out_at = now();
            $locked->open_presence_key = null;
            $locked->save();
            $this->correction($locked, $requestId, $hash, 'checkout', $before, $actorId, $reason ?? 'Checked out');
            $this->audit($actorId, 'attendance.checkout.recorded', $locked, $requestId, $before, $reason);

            DB::afterCommit(fn () => AttendanceCheckedOut::dispatch(
                eventId: $requestId,
                tenantId: $locked->tenant_id,
                branchId: $locked->branch_id,
                attendanceRecordId: $locked->id,
                memberId: $locked->member_id,
                membershipId: $locked->membership_id,
                actorId: $actorId,
                deviceId: null,
                source: 'manual',
                result: 'checked_out',
                occurredAt: $locked->checked_out_at->toIso8601String(),
                overrideApplied: false,
            ));

            return $locked;
        });
    }

    /**
     * @param  array{checked_in_at?:string|null,checked_out_at?:string|null}  $changes
     */
    public function correct(
        AttendanceRecord $record,
        string $requestId,
        array $changes,
        int $actorId,
        string $reason,
    ): AttendanceRecord {
        $hash = $this->hash([
            'operation' => 'correction',
            'record_id' => $record->id,
            'changes' => $changes,
            'reason' => $reason,
        ]);

        return DB::transaction(function () use ($record, $requestId, $changes, $actorId, $reason, $hash): AttendanceRecord {
            if ($existing = $this->existing($requestId, $hash)) {
                return $existing->attendanceRecord;
            }

            $locked = AttendanceRecord::query()->lockForUpdate()->findOrFail($record->id);
            if ($existing = $this->existing($requestId, $hash)) {
                return $existing->attendanceRecord;
            }
            if ($locked->status === AttendanceStatus::Reversed) {
                throw new DomainException('A reversed attendance record cannot be corrected.');
            }

            $before = $this->snapshot($locked);
            $locked->fill(array_intersect_key($changes, array_flip(['checked_in_at', 'checked_out_at'])));
            if ($locked->checked_out_at && $locked->checked_out_at->lessThan($locked->checked_in_at)) {
                throw new DomainException('Check-out time cannot be before check-in time.');
            }
            $locked->status = $locked->checked_out_at
                ? AttendanceStatus::CheckedOut
                : AttendanceStatus::CheckedIn;
            $locked->open_presence_key = $locked->status === AttendanceStatus::CheckedIn
                && $this->settings->forBranch($locked->branch_id)->mode === AttendanceMode::CheckInOut
                    ? implode(':', [$locked->tenant_id, $locked->branch_id, $locked->member_id])
                    : null;
            $locked->save();
            $this->correction($locked, $requestId, $hash, 'correction', $before, $actorId, $reason);
            $this->audit($actorId, 'attendance.corrected', $locked, $requestId, $before, $reason);

            DB::afterCommit(fn () => AttendanceCorrected::dispatch(
                eventId: $requestId,
                tenantId: $locked->tenant_id,
                branchId: $locked->branch_id,
                attendanceRecordId: $locked->id,
                memberId: $locked->member_id,
                membershipId: $locked->membership_id,
                actorId: $actorId,
                deviceId: null,
                source: 'manual',
                result: 'corrected',
                correctionType: 'correction',
                occurredAt: now()->toIso8601String(),
                overrideApplied: false,
            ));

            return $locked;
        });
    }

    public function reverse(
        AttendanceRecord $record,
        string $requestId,
        int $actorId,
        string $reason,
    ): AttendanceRecord {
        $hash = $this->hash([
            'operation' => 'reversal',
            'record_id' => $record->id,
            'reason' => $reason,
        ]);

        return DB::transaction(function () use ($record, $requestId, $actorId, $reason, $hash): AttendanceRecord {
            if ($existing = $this->existing($requestId, $hash)) {
                return $existing->attendanceRecord;
            }

            $locked = AttendanceRecord::query()->lockForUpdate()->findOrFail($record->id);
            if ($existing = $this->existing($requestId, $hash)) {
                return $existing->attendanceRecord;
            }
            if ($locked->status === AttendanceStatus::Reversed) {
                throw new DomainException('This attendance record was already reversed.');
            }

            $before = $this->snapshot($locked);
            $locked->status = AttendanceStatus::Reversed;
            $locked->open_presence_key = null;
            $locked->save();
            $this->correction($locked, $requestId, $hash, 'reversal', $before, $actorId, $reason);
            $this->audit($actorId, 'attendance.reversed', $locked, $requestId, $before, $reason);

            DB::afterCommit(function () use ($requestId, $locked, $actorId): void {
                AttendanceReversed::dispatch(
                    eventId: $requestId,
                    tenantId: $locked->tenant_id,
                    branchId: $locked->branch_id,
                    attendanceRecordId: $locked->id,
                    memberId: $locked->member_id,
                    membershipId: $locked->membership_id,
                    actorId: $actorId,
                    deviceId: null,
                    source: 'manual',
                    result: 'reversed',
                    occurredAt: now()->toIso8601String(),
                    overrideApplied: false,
                );
                AttendanceCorrected::dispatch(
                    eventId: $requestId,
                    tenantId: $locked->tenant_id,
                    branchId: $locked->branch_id,
                    attendanceRecordId: $locked->id,
                    memberId: $locked->member_id,
                    membershipId: $locked->membership_id,
                    actorId: $actorId,
                    deviceId: null,
                    source: 'manual',
                    result: 'corrected',
                    correctionType: 'reversal',
                    occurredAt: now()->toIso8601String(),
                    overrideApplied: false,
                );
            });

            return $locked;
        });
    }

    private function existing(string $requestId, string $hash): ?AttendanceCorrection
    {
        $existing = AttendanceCorrection::query()->where('request_id', $requestId)->first();
        if ($existing && ! hash_equals((string) $existing->request_hash, $hash)) {
            throw new DomainException('The idempotency key was already used for a different attendance change.');
        }

        return $existing;
    }

    /**
     * @param  array<string, mixed>  $before
     */
    private function correction(
        AttendanceRecord $record,
        string $requestId,
        string $hash,
        string $type,
        array $before,
        int $actorId,
        string $reason,
    ): AttendanceCorrection {
        return AttendanceCorrection::query()->create([
            'tenant_id' => $record->tenant_id,
            'attendance_record_id' => $record->id,
            'request_id' => $requestId,
            'request_hash' => $hash,
            'correction_type' => $type,
            'before_values' => $before,
            'after_values' => $this->snapshot($record),
            'reason' => $reason,
            'corrected_by' => $actorId,
            'corrected_at' => now(),
        ]);
    }

    /** @return array<string, mixed> */
    private function snapshot(AttendanceRecord $record): array
    {
        return [
            'status' => $record->status->value,
            'checked_in_at' => $record->checked_in_at?->toIso8601String(),
            'checked_out_at' => $record->checked_out_at?->toIso8601String(),
        ];
    }

    /**
     * @param  array<string, mixed>  $before
     */
    private function audit(
        int $actorId,
        string $action,
        AttendanceRecord $record,
        string $requestId,
        array $before,
        ?string $reason,
    ): void {
        $actor = User::query()->findOrFail($actorId);
        $this->audit->log($actor, $action, $record, [
            'request_id' => $requestId,
            'before' => $before,
            'after' => $this->snapshot($record),
            'reason' => $reason,
        ]);
    }

    /** @param array<string, mixed> $data */
    private function hash(array $data): string
    {
        return hash('sha256', json_encode($data, JSON_THROW_ON_ERROR));
    }
}
