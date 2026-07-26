<?php

namespace App\Modules\MemberPortal\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\User;
use App\Modules\MemberPortal\Models\MemberPortalAccount;
use App\Modules\MemberPortal\Notifications\MemberPortalInvitationNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class MemberPortalInviteController extends Controller
{
    public function store(Request $request, Member $member): RedirectResponse
    {
        $this->authorize('update', $member);

        if (! $member->email) {
            throw ValidationException::withMessages([
                'email' => 'This member has no email address on file. Add one before inviting them to the portal.',
            ]);
        }

        $account = $member->portalAccount()->first();

        if ($account?->isActive()) {
            throw ValidationException::withMessages([
                'portal_account' => 'This member already has an active portal account.',
            ]);
        }

        $existingUser = $account?->user;
        $inviter = $request->user();

        $conflictingUser = $existingUser === null
            ? User::query()->where('email', $member->email)->first()
            : null;

        if ($conflictingUser !== null) {
            throw ValidationException::withMessages([
                'email' => 'That email address is already used by another account.',
            ]);
        }

        $user = DB::transaction(function () use ($member, $existingUser, $inviter) {
            $user = $existingUser ?? User::create([
                'tenant_id' => $inviter->tenant_id,
                'name' => $member->fullName(),
                'email' => $member->email,
                'password' => Str::password(40),
                'status' => 'invited',
            ]);

            if ($existingUser !== null && $existingUser->status !== 'invited') {
                $existingUser->forceFill(['status' => 'invited'])->save();
            }

            MemberPortalAccount::query()->updateOrCreate(
                ['tenant_id' => $inviter->tenant_id, 'member_id' => $member->id],
                [
                    'user_id' => $user->id,
                    'status' => MemberPortalAccount::STATUS_INVITED,
                    'invited_at' => now(),
                    'suspended_at' => null,
                ],
            );

            return $user;
        });

        $user->notify(new MemberPortalInvitationNotification($inviter->tenant));

        Inertia::flash('toast', ['type' => 'success', 'message' => "Portal invitation sent to {$member->email}."]);

        return back();
    }
}
