<?php

namespace App\Modules\MemberPortal\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use App\Modules\Gym\Models\GymProfile;
use App\Modules\MemberPortal\Models\MemberPortalAccount;
use App\Modules\MemberPortal\Requests\AcceptMemberPortalInvitationRequest;
use App\Shared\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class MemberPortalInvitationController extends Controller
{
    /**
     * Renders the invitation page directly with the invitee's details as
     * props (no separate client-side fetch) — the signed link's signature
     * is bound to this exact URL, so the accept POST below must reuse the
     * same path rather than calling a differently-prefixed API endpoint.
     */
    public function show(Request $request, User $user): Response
    {
        $valid = $request->hasValidSignature()
            && $user->status === 'invited'
            && MemberPortalAccount::query()
                ->where('user_id', $user->id)
                ->where('status', MemberPortalAccount::STATUS_INVITED)
                ->exists();

        $gymProfile = $this->resolveGymProfile($user->tenant_id);

        return Inertia::render('member-portal/accept-invitation', [
            'userId' => $user->id,
            'invalid' => ! $valid,
            'name' => $valid ? $user->name : null,
            'email' => $valid ? $user->email : null,
            'gymName' => $gymProfile?->legal_name ?? $user->tenant?->name,
            'gymLogoUrl' => $gymProfile?->logo_path
                ? Storage::disk('public')->url($gymProfile->logo_path)
                : null,
        ]);
    }

    public function accept(AcceptMemberPortalInvitationRequest $request, User $user): JsonResponse
    {
        $account = MemberPortalAccount::query()
            ->where('user_id', $user->id)
            ->where('status', MemberPortalAccount::STATUS_INVITED)
            ->first();

        abort_if($account === null || $user->status !== 'invited', 404);

        DB::transaction(function () use ($request, $user, $account) {
            $user->forceFill([
                'password' => $request->string('password')->toString(),
                'status' => 'active',
                'email_verified_at' => now(),
            ])->save();

            $account->forceFill([
                'status' => MemberPortalAccount::STATUS_ACTIVE,
                'activated_at' => now(),
            ])->save();

            $memberRole = Role::query()->whereNull('tenant_id')->where('slug', 'member')->first();

            if ($memberRole !== null) {
                $user->roles()->syncWithoutDetaching([$memberRole->id]);
            }
        });

        Auth::login($user);
        $request->session()->regenerate();

        return ApiResponse::success(null, 'Invitation accepted. You are now signed in.');
    }

    /**
     * Branding is a nice-to-have on this page, not a requirement — never
     * let a lookup failure (e.g. mid-migration) break invitation acceptance.
     */
    private function resolveGymProfile(?int $tenantId): ?GymProfile
    {
        if ($tenantId === null) {
            return null;
        }

        try {
            return GymProfile::query()->firstWhere('tenant_id', $tenantId);
        } catch (Throwable $e) {
            Log::warning('Unable to resolve gym branding for the invitation page.', ['exception' => $e]);

            return null;
        }
    }
}
