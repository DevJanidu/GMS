<?php

namespace App\Modules\Attendance\DTOs;

use App\Modules\Attendance\Enums\AttendanceSource;

final readonly class AttendanceCommand
{
    public function __construct(
        public string $requestId,
        public AttendanceSource $source,
        public int $actorId,
        public ?string $qrToken = null,
        public ?int $memberId = null,
        public ?string $deviceId = null,
        public string $action = 'auto',
        public bool $overrideRequested = false,
        public ?string $overrideReason = null,
    ) {}

    public function fingerprint(): string
    {
        return hash('sha256', json_encode([
            'source' => $this->source->value,
            'qr_token_hash' => $this->qrToken ? hash('sha256', $this->qrToken) : null,
            'member_id' => $this->memberId,
            'device_id' => $this->deviceId,
            'action' => $this->action,
            'override_requested' => $this->overrideRequested,
            'override_reason' => $this->overrideReason,
        ], JSON_THROW_ON_ERROR));
    }
}
