<?php

namespace App\Modules\Membership\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Membership\Actions\ReactivateMembershipAction;
use App\Modules\Membership\Models\Membership;
use App\Modules\Membership\Requests\ReactivateMembershipRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class MembershipReactivationController extends Controller
{
    public function update(ReactivateMembershipRequest $request, Membership $membership, ReactivateMembershipAction $action): RedirectResponse
    {
        $action->execute($membership, $request->user()->id);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Membership reactivated.']);

        return back();
    }
}
