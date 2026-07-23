<?php

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;

final readonly class MemberRegistered
{
    use Dispatchable;

    public function __construct(
        public string $eventId,
        public string $occurredAt,
        public int $tenantId,
        public ?int $branchId,
        public int $memberId,
        public ?int $registeredBy,
    ) {}
}
