<?php

namespace App\Modules\Membership\Services;

use App\Modules\Membership\Contracts\MembershipAccessChecker;
use App\Modules\Membership\Enums\MembershipStatus;
use App\Modules\Membership\Models\Membership;
use Carbon\CarbonImmutable;

class MembershipAccessCheckerService implements MembershipAccessChecker
{
    public function hasAccess(Membership $membership, ?CarbonImmutable $at = null): bool
    {
        // Grace period keeps access open (status stays Active) so a member
        // isn't locked out mid-negotiation of a late renewal; the daily
        // expiry scheduler is what eventually flips them to Expired.
        return $membership->status === MembershipStatus::Active;
    }

    public function isInGracePeriod(Membership $membership, ?CarbonImmutable $at = null): bool
    {
        return $membership->isInGracePeriod($at);
    }
}
