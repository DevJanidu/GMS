<?php

namespace App\Modules\Membership\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Membership\Enums\MembershipEventType;
use App\Modules\Membership\Events\MembershipExpiring;
use App\Modules\Membership\Models\Membership;
use App\Modules\Membership\Requests\BulkReminderRequest;
use App\Modules\Membership\Services\MembershipEventRecorder;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class MembershipReminderController extends Controller
{
    /**
     * Records a reminder request against each selected membership and
     * re-fires MembershipExpiring so a listening Notification module
     * (Phase 3) can pick it up. This module never sends the notification
     * itself — see SRS Rule 6 and INTEGRATION_NOTES.md.
     */
    public function store(BulkReminderRequest $request, MembershipEventRecorder $eventRecorder): RedirectResponse
    {
        $memberships = Membership::query()
            ->whereKey($request->validated('membership_ids'))
            ->get();

        foreach ($memberships as $membership) {
            $eventRecorder->record(
                $membership,
                MembershipEventType::ReminderRequested,
                $membership->status,
                $membership->status,
                $request->user()->id,
            );

            MembershipExpiring::dispatch($membership);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Reminder queued for {$memberships->count()} membership(s).",
        ]);

        return back();
    }
}
