<?php

namespace App\Modules\Membership\Services;

use App\Enums\DurationUnit;
use App\Models\Plan;
use App\Modules\Membership\Contracts\MembershipDateCalculator;
use App\Modules\Membership\DTOs\MembershipDates;
use Carbon\CarbonImmutable;

class MembershipDateCalculatorService implements MembershipDateCalculator
{
    public function calculate(Plan $plan, CarbonImmutable $startsOn): MembershipDates
    {
        $startsOn = $startsOn->startOfDay();

        $expiresOn = match ($plan->duration_unit) {
            DurationUnit::Days => $startsOn->addDays($plan->duration_value),
            DurationUnit::Weeks => $startsOn->addWeeks($plan->duration_value),
            DurationUnit::Months => $startsOn->addMonths($plan->duration_value),
            DurationUnit::Years => $startsOn->addYears($plan->duration_value),
        };

        $graceDays = (int) ($plan->access_rules['grace_days_allowed'] ?? config('membership.default_grace_days'));

        return new MembershipDates(
            startsOn: $startsOn,
            expiresOn: $expiresOn,
            graceDays: $graceDays,
            graceEndsOn: $expiresOn->addDays($graceDays),
        );
    }
}
