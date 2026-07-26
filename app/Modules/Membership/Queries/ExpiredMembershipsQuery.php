<?php

namespace App\Modules\Membership\Queries;

use App\Modules\Membership\Enums\MembershipStatus;
use App\Modules\Membership\Models\Membership;
use Illuminate\Database\Eloquent\Builder;

class ExpiredMembershipsQuery
{
    /**
     * @return Builder<Membership>
     */
    public static function build(?int $branchId = null): Builder
    {
        return Membership::query()
            ->with(['member', 'plan', 'branch'])
            ->where('status', MembershipStatus::Expired)
            ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
            ->orderByDesc('expired_at');
    }
}
