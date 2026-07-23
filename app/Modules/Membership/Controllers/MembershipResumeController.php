<?php

namespace App\Modules\Membership\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Membership\Actions\ResumeMembershipAction;
use App\Modules\Membership\Models\Membership;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MembershipResumeController extends Controller
{
    public function update(Request $request, Membership $membership, ResumeMembershipAction $action): RedirectResponse
    {
        $this->authorize('resume', $membership);

        $action->execute($membership, $request->user()->id);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Membership resumed.']);

        return back();
    }
}
