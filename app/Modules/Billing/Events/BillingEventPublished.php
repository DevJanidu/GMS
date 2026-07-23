<?php

namespace App\Modules\Billing\Events;

final readonly class BillingEventPublished
{
    /**
     * @param  array<string, mixed>  $payload
     */
    public function __construct(
        public string $eventId,
        public string $type,
        public string $aggregateType,
        public int $aggregateId,
        public int $tenantId,
        public ?int $branchId,
        public array $payload,
    ) {}
}
