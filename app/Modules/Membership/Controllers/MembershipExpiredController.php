<?php

namespace App\Modules\Membership\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Modules\Membership\Models\Membership;
use App\Modules\Membership\Queries\ExpiredMembershipsQuery;
use App\Modules\Membership\Resources\MembershipResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MembershipExpiredController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Membership::class);

        $branchId = $request->integer('branch_id') ?: null;

        $memberships = ExpiredMembershipsQuery::build($branchId)
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('renewals/expired', [
            'memberships' => MembershipResource::collection($memberships),
            'filters' => ['branch_id' => $branchId],
            'branches' => Branch::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }
}
