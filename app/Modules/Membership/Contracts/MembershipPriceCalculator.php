<?php

namespace App\Modules\Membership\Contracts;

use App\Models\Plan;
use App\Modules\Membership\DTOs\MembershipPriceBreakdown;

interface MembershipPriceCalculator
{
    public function calculate(Plan $plan): MembershipPriceBreakdown;
}
