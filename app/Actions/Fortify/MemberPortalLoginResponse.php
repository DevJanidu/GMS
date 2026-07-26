<?php

namespace App\Actions\Fortify;

use App\Modules\MemberPortal\Models\MemberPortalAccount;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Fortify;
use Symfony\Component\HttpFoundation\Response;

/**
 * A member-portal-only account (no staff roles beyond the "member" marker
 * role) has nothing to see at "/dashboard" — every dashboard/report
 * endpoint requires a permission that only comes from a staff role. Send
 * those accounts to their own portal instead of Fortify's hardcoded
 * config('fortify.home').
 */
class MemberPortalLoginResponse implements LoginResponseContract
{
    /**
     * @param  Request  $request
     * @return Response
     */
    public function toResponse($request)
    {
        if ($request->wantsJson()) {
            return response()->json(['two_factor' => false]);
        }

        $user = $request->user();

        $hasOnlyMemberRole = $user !== null
            && $user->roles()->where('slug', '!=', 'member')->doesntExist();

        $hasActivePortalAccount = $hasOnlyMemberRole && MemberPortalAccount::query()
            ->where('user_id', $user->id)
            ->where('status', MemberPortalAccount::STATUS_ACTIVE)
            ->exists();

        // A stale "intended" URL from an earlier, unrelated unauthenticated
        // request (e.g. a shared front-desk computer, or a session left
        // over from a different account) must never cross into the other
        // area of the app — a member has no business landing in the staff
        // dashboard and a staff account has no member-portal account to
        // land in, so a mismatched intended URL is discarded rather than
        // honored.
        $intendedPath = parse_url((string) $request->session()->get('url.intended'), PHP_URL_PATH);
        $intendedIsPortal = $intendedPath !== null && str_starts_with($intendedPath, '/member-portal');

        if ($intendedIsPortal !== $hasActivePortalAccount) {
            $request->session()->forget('url.intended');
        }

        return redirect()->intended($hasActivePortalAccount ? '/member-portal' : Fortify::redirects('login'));
    }
}
