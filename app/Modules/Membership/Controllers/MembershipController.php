<?php

namespace App\Modules\Membership\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Member;
use App\Models\Plan;
use App\Modules\Membership\Actions\SellMembershipAction;
use App\Modules\Membership\Models\Membership;
use App\Modules\Membership\Requests\StoreMembershipRequest;
use App\Modules\Membership\Resources\MembershipResource;
use App\Tenancy\Services\BranchContext;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class MembershipController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Membership::class);

        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();
        $branchId = $request->integer('branch_id') ?: null;

        $memberships = Membership::query()
            ->with(['member', 'plan', 'branch'])
            ->when($search !== '', function ($query) use ($search) {
                $query->whereHas('member', function ($query) use ($search) {
                    $query->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('member_number', 'like', "%{$search}%");
                });
            })
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('memberships/index', [
            'memberships' => MembershipResource::collection($memberships),
            'filters' => [
                'search' => $search ?: null,
                'status' => $status ?: null,
                'branch_id' => $branchId,
            ],
            'branches' => Branch::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('sell', Membership::class);

        return Inertia::render('memberships/create', [
            'members' => Member::query()
                ->where('status', 'active')
                ->orderBy('first_name')
                ->limit(500)
                ->get(['id', 'member_number', 'first_name', 'last_name', 'email'])
                ->map(fn (Member $member) => [
                    'id' => $member->id,
                    'member_number' => $member->member_number,
                    'full_name' => $member->fullName(),
                    'email' => $member->email,
                ]),
            'plans' => Plan::query()
                ->where('status', 'active')
                ->orderBy('name')
                ->get(['id', 'name', 'price', 'joining_fee', 'duration_value', 'duration_unit']),
            'preselected_member_id' => $request->integer('member_id') ?: null,
        ]);
    }

    public function store(StoreMembershipRequest $request, SellMembershipAction $action): RedirectResponse
    {
        $data = $request->validated();

        $member = Member::query()->findOrFail($data['member_id']);
        $plan = Plan::query()->findOrFail($data['plan_id']);
        $branchId = $data['branch_id'] ?? app(BranchContext::class)->id() ?? $member->branch_id;

        if (! $branchId) {
            throw ValidationException::withMessages([
                'branch_id' => 'A branch is required to sell this membership.',
            ]);
        }

        $membership = $action->execute(
            member: $member,
            plan: $plan,
            branchId: $branchId,
            startsOn: isset($data['starts_on'])
                ? CarbonImmutable::parse($data['starts_on'])->startOfDay()
                : CarbonImmutable::now()->startOfDay(),
            soldBy: $request->user()->id,
            initialPayment: $data['initial_payment'] ?? null,
            paymentMethod: $data['payment_method'] ?? null,
            notes: $data['notes'] ?? null,
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => "Membership sold to {$member->fullName()}."]);

        return to_route('memberships.show', $membership);
    }

    public function show(Membership $membership): Response
    {
        $this->authorize('view', $membership);

        $membership->load(['member', 'plan', 'branch', 'previousMembership', 'renewal', 'events.actor']);

        return Inertia::render('memberships/show', [
            'membership' => (new MembershipResource($membership))->resolve(),
        ]);
    }
}
