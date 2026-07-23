<?php

namespace App\Modules\Membership\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Membership\Actions\CancelMembershipAction;
use App\Modules\Membership\Models\Membership;
use App\Modules\Membership\Requests\CancelMembershipRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class MembershipCancellationController extends Controller
{
    public function update(CancelMembershipRequest $request, Membership $membership, CancelMembershipAction $action): RedirectResponse
    {
        $action->execute($membership, $request->validated('reason'), $request->user()->id);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Membership cancelled.']);

        return back();
    }
}
