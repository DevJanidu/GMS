<?php

namespace App\Modules\Membership\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Membership\Actions\SuspendMembershipAction;
use App\Modules\Membership\Models\Membership;
use App\Modules\Membership\Requests\SuspendMembershipRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class MembershipSuspensionController extends Controller
{
    public function update(SuspendMembershipRequest $request, Membership $membership, SuspendMembershipAction $action): RedirectResponse
    {
        $action->execute($membership, $request->validated('reason'), $request->user()->id);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Membership suspended.']);

        return back();
    }
}
