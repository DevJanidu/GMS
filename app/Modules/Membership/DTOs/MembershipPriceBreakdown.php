<?php

namespace App\Modules\Membership\DTOs;

final readonly class MembershipPriceBreakdown
{
    public function __construct(
        public float $price,
        public float $joiningFee,
        public float $total,
    ) {}
}
