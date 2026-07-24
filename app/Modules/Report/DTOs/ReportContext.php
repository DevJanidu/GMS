<?php

namespace App\Modules\Report\DTOs;

final readonly class ReportContext
{
    /** @param list<int> $branchIds */
    public function __construct(
        public int $tenantId,
        public int $userId,
        public array $branchIds,
        public string $timezone,
        public string $currency,
    ) {}
}
