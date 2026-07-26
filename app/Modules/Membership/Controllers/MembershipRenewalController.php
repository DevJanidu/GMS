<?php

namespace App\Modules\Membership\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Modules\Membership\Actions\RenewMembershipAction;
use App\Modules\Membership\Models\Membership;
use App\Modules\Membership\Requests\RenewMembershipRequest;
use App\Modules\Membership\Resources\MembershipResource;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MembershipRenewalController extends Controller
{
    public function create(Membership $membership): Response
    {
        $this->authorize('renew', $membership);

        $membership->load(['member', 'plan', 'branch']);

        return Inertia::render('memberships/renew', [
            'membership' => (new MembershipResource($membership))->resolve(),
            'plans' => Plan::query()
                ->where('status', 'active')
                ->orderBy('name')
                ->get(['id', 'name', 'price', 'joining_fee', 'duration_value', 'duration_unit'])
                ->map(fn (Plan $plan) => [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    // price/joining_fee are `decimal:2` casts, which Eloquent
                    // serializes as strings (e.g. "50.00") — the frontend
                    // calls .toFixed()/arithmetic on these, so they must be
                    // real numbers here, matching PlanResource's convention.
                    'price' => (float) $plan->price,
                    'joining_fee' => (float) $plan->joining_fee,
                    'duration_value' => $plan->duration_value,
                    'duration_unit' => $plan->duration_unit->value,
                ]),
        ]);
    }

    public function store(RenewMembershipRequest $request, Membership $membership, RenewMembershipAction $action): RedirectResponse
    {
        $data = $request->validated();

        $plan = Plan::query()->findOrFail($request->integer('plan_id'));

        $renewed = $action->execute(
            current: $membership,
            plan: $plan,
            renewedBy: $request->user()->id,
            initialPayment: $data['initial_payment'] ?? null,
            paymentMethod: $data['payment_method'] ?? null,
            notes: $data['notes'] ?? null,
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Membership renewed.']);

        return to_route('memberships.show', $renewed);
    }
}
