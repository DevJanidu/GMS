<?php

namespace App\Modules\Report\DTOs;

use Carbon\CarbonImmutable;

final readonly class ReportFilters
{
    public function __construct(
        public CarbonImmutable $from,
        public CarbonImmutable $to,
        public ?int $branchId = null,
        public ?int $planId = null,
        public ?string $memberStatus = null,
        public ?string $paymentMethod = null,
        public int $page = 1,
        public int $perPage = 20,
    ) {}

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return [
            'date_from' => $this->from->toDateString(), 'date_to' => $this->to->toDateString(),
            'branch_id' => $this->branchId, 'plan_id' => $this->planId,
            'member_status' => $this->memberStatus, 'payment_method' => $this->paymentMethod,
            'page' => $this->page, 'per_page' => $this->perPage,
        ];
    }
}
