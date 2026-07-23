<?php

namespace App\Modules\Membership\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Membership\Enums\MembershipStatus;
use App\Modules\Membership\Models\Membership;
use App\Modules\Membership\Queries\ExpiredMembershipsQuery;
use App\Modules\Membership\Queries\ExpiringMembershipsQuery;
use App\Modules\Membership\Queries\GracePeriodMembershipsQuery;
use App\Modules\Membership\Resources\MembershipResource;
use Inertia\Inertia;
use Inertia\Response;

class RenewalDashboardController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Membership::class);

        return Inertia::render('renewals/dashboard', [
            'stats' => [
                'expiring_soon' => (clone ExpiringMembershipsQuery::build())->count(),
                'in_grace_period' => (clone GracePeriodMembershipsQuery::build())->count(),
                'expired' => (clone ExpiredMembershipsQuery::build())->count(),
                'active' => Membership::query()->where('status', MembershipStatus::Active)->count(),
            ],
            'recent_renewals' => MembershipResource::collection(
                Membership::query()
                    ->with(['member', 'plan'])
                    ->whereNotNull('previous_membership_id')
                    ->latest()
                    ->limit(10)
                    ->get(),
            ),
        ]);
    }
}
