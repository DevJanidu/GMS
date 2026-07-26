<?php

namespace App\Modules\Attendance\Services;

use App\Modules\Attendance\Models\AttendanceCorrection;
use App\Modules\Attendance\Models\AttendanceRecord;
use App\Modules\Attendance\Models\AttendanceScanLog;
use App\Modules\Attendance\Models\AttendanceSetting;

class AttendancePresenter
{
    /** @return array<string, mixed> */
    public function record(AttendanceRecord $record): array
    {
        $record->loadMissing(['member', 'membership', 'branch', 'recordedBy', 'overriddenBy', 'corrections.correctedBy']);

        return [
            'id' => $record->id,
            'branch' => ['id' => $record->branch_id, 'name' => $record->branch?->name],
            'member' => [
                'id' => $record->member_id,
                'member_number' => $record->member?->member_number,
                'display_name' => $record->member?->fullName(),
            ],
            'membership_id' => $record->membership_id,
            'status' => $record->status->value,
            'source' => $record->source->value,
            'checked_in_at' => $record->checked_in_at?->toIso8601String(),
            'checked_out_at' => $record->checked_out_at?->toIso8601String(),
            'device_id' => $record->device_id,
            'recorded_by' => $record->recordedBy
                ? ['id' => $record->recordedBy->id, 'name' => $record->recordedBy->name]
                : null,
            'override' => $record->override_by ? [
                'actor' => ['id' => $record->overriddenBy?->id, 'name' => $record->overriddenBy?->name],
                'reason' => $record->override_reason,
            ] : null,
            'corrections' => $record->corrections->map(
                fn (AttendanceCorrection $item): array => [
                    'id' => $item->id,
                    'type' => $item->correction_type,
                    'before' => $item->before_values,
                    'after' => $item->after_values,
                    'reason' => $item->reason,
                    'corrected_at' => $item->corrected_at?->toIso8601String(),
                    'corrected_by' => $item->correctedBy
                        ? ['id' => $item->correctedBy->id, 'name' => $item->correctedBy->name]
                        : null,
                ],
            )->values()->all(),
        ];
    }

    /** @return array<string, mixed> */
    public function scan(AttendanceScanLog $log): array
    {
        $log->loadMissing('member');

        return [
            'id' => $log->id,
            'attendance_record_id' => $log->attendance_record_id,
            'member' => $log->member ? [
                'id' => $log->member->id,
                'member_number' => $log->member->member_number,
                'display_name' => $log->member->fullName(),
            ] : null,
            'result' => $log->result,
            'reason_code' => $log->reason_code,
            'message' => $log->reason,
            'source' => $log->source->value,
            'device_id' => $log->device_id,
            'scanned_at' => $log->scanned_at?->toIso8601String(),
        ];
    }

    /** @return array<string, mixed> */
    public function setting(AttendanceSetting $setting): array
    {
        return [
            'id' => $setting->id,
            'branch_id' => $setting->branch_id,
            'mode' => $setting->mode->value,
            'duplicate_window_seconds' => $setting->duplicate_window_seconds,
            'allow_manual_entry' => $setting->allow_manual_entry,
            'manager_override_required' => $setting->manager_override_required,
            'visit_limit_rules' => (object) ($setting->visit_limit_rules ?? []),
        ];
    }
}
