<?php

namespace App\Modules\Notification\DTOs;

use Carbon\CarbonImmutable;

final readonly class NotificationEvent
{
    /**
     * @param  array<string, scalar|null>  $variables
     */
    public function __construct(
        public string $sourceEventId,
        public string $eventType,
        public int $tenantId,
        public ?int $branchId,
        public int $memberId,
        public array $variables,
        public CarbonImmutable $occurredAt,
    ) {}
}
