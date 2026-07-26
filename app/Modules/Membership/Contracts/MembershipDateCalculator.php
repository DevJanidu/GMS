<?php

namespace App\Modules\Membership\Contracts;

use App\Models\Plan;
use App\Modules\Membership\DTOs\MembershipDates;
use Carbon\CarbonImmutable;

/**
 * One of the shared contracts named in SRS B.5. Kept module-local (see
 * INTEGRATION_NOTES.md) since Membership is the sole owner and consumer of
 * membership date math today.
 */
interface MembershipDateCalculator
{
    public function calculate(Plan $plan, CarbonImmutable $startsOn): MembershipDates;
}
