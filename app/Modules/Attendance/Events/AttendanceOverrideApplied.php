<?php

namespace App\Modules\Attendance\Events;

use Illuminate\Foundation\Events\Dispatchable;

final readonly class AttendanceOverrideApplied
{
    use Dispatchable;

    public function __construct(
        public string $eventId,
        public int $tenantId,
        public int $branchId,
        public int $attendanceRecordId,
        public int $memberId,
        public ?int $membershipId,
        public int $actorId,
        public ?string $deviceId,
        public string $source,
        public string $result,
        public string $reasonCode,
        public string $occurredAt,
        public bool $overrideApplied,
    ) {}
}
