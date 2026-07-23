<?php

namespace App\Modules\Membership\Queries;

use App\Modules\Membership\Enums\MembershipStatus;
use App\Modules\Membership\Models\Membership;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;

class GracePeriodMembershipsQuery
{
    /**
     * Memberships past their expiry date but still within their grace
     * window — status is still Active (see Membership::isInGracePeriod).
     *
     * @return Builder<Membership>
     */
    public static function build(?int $branchId = null): Builder
    {
        $today = CarbonImmutable::now()->startOfDay();

        return Membership::query()
            ->with(['member', 'plan', 'branch'])
            ->where('status', MembershipStatus::Active)
            ->whereDate('expires_on', '<', $today->toDateString())
            ->whereDate('grace_ends_on', '>=', $today->toDateString())
            ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
            ->orderBy('grace_ends_on');
    }
}
