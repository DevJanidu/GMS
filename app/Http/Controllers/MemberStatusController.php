<?php

namespace App\Http\Controllers;

use App\Enums\MemberStatus;
use App\Http\Requests\Members\UpdateMemberStatusRequest;
use App\Models\Member;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class MemberStatusController extends Controller
{
    public function update(UpdateMemberStatusRequest $request, Member $member): RedirectResponse
    {
        $status = MemberStatus::from($request->validated('status'));

        $member->status = $status;
        $member->archived_at = $status === MemberStatus::Archived ? now() : null;
        $member->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => "Member marked as {$status->label()}."]);

        return back();
    }
}
