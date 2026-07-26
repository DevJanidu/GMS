<?php

namespace App\Modules\Membership\Queries;

use App\Modules\Membership\Enums\MembershipStatus;
use App\Modules\Membership\Models\Membership;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;

class ExpiringMembershipsQuery
{
    /**
     * @return Builder<Membership>
     */
    public static function build(?int $branchId = null): Builder
    {
        $today = CarbonImmutable::now()->startOfDay();
        $threshold = $today->addDays((int) config('membership.expiring_soon_within_days'));

        return Membership::query()
            ->with(['member', 'plan', 'branch'])
            ->where('status', MembershipStatus::Active)
            ->whereDate('expires_on', '>=', $today->toDateString())
            ->whereDate('expires_on', '<=', $threshold->toDateString())
            ->whereDoesntHave('renewal')
            ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
            ->orderBy('expires_on');
    }
}
