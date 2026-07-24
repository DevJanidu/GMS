<?php

namespace App\Modules\Attendance\DTOs;

use App\Modules\Attendance\Enums\AttendanceRejectionReason;

final readonly class AttendanceResult
{
    /**
     * @param  array{id:int,member_number:string,display_name:string}|null  $member
     */
    public function __construct(
        public bool $accepted,
        public string $result,
        public ?int $attendanceRecordId = null,
        public ?array $member = null,
        public ?string $occurredAt = null,
        public bool $replayed = false,
        public bool $overrideApplied = false,
        public ?AttendanceRejectionReason $reason = null,
    ) {}

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        $data = [
            'result' => $this->result,
            'attendance_record_id' => $this->attendanceRecordId,
            'member' => $this->member,
            'replayed' => $this->replayed,
            'override_applied' => $this->overrideApplied,
            'reason_code' => $this->reason?->value,
        ];

        if ($this->occurredAt !== null && $this->result === 'checked_in') {
            $data['checked_in_at'] = $this->occurredAt;
        }

        if ($this->occurredAt !== null && $this->result === 'checked_out') {
            $data['checked_out_at'] = $this->occurredAt;
        }

        return array_filter($data, fn (mixed $value): bool => $value !== null);
    }
}
