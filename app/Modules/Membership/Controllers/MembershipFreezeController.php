<?php

namespace App\Modules\Membership\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Membership\Actions\FreezeMembershipAction;
use App\Modules\Membership\Models\Membership;
use App\Modules\Membership\Requests\FreezeMembershipRequest;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class MembershipFreezeController extends Controller
{
    public function update(FreezeMembershipRequest $request, Membership $membership, FreezeMembershipAction $action): RedirectResponse
    {
        $data = $request->validated();

        $action->execute(
            membership: $membership,
            resumesOn: isset($data['resumes_on']) ? CarbonImmutable::parse($data['resumes_on']) : null,
            actorId: $request->user()->id,
            reason: $data['reason'] ?? null,
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Membership frozen.']);

        return back();
    }
}
