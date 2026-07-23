<?php

namespace App\Modules\Membership\Services;

use App\Models\Plan;
use App\Modules\Membership\Contracts\MembershipPriceCalculator;
use App\Modules\Membership\DTOs\MembershipPriceBreakdown;

class MembershipPriceCalculatorService implements MembershipPriceCalculator
{
    public function calculate(Plan $plan): MembershipPriceBreakdown
    {
        $price = (float) $plan->price;
        $joiningFee = (float) $plan->joining_fee;

        return new MembershipPriceBreakdown(
            price: $price,
            joiningFee: $joiningFee,
            total: round($price + $joiningFee, 2),
        );
    }
}
