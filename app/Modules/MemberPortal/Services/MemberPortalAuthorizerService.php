<?php

namespace App\Modules\MemberPortal\Services;

use App\Models\User;
use App\Modules\MemberPortal\Contracts\MemberPortalAuthorizer;
use App\Modules\MemberPortal\Models\MemberPortalAccount;
use Illuminate\Auth\Access\AuthorizationException;

class MemberPortalAuthorizerService implements MemberPortalAuthorizer
{
    public function accountFor(User $user): MemberPortalAccount
    {
        $account = MemberPortalAccount::query()
            ->with('member')
            ->where('tenant_id', $user->tenant_id)
            ->where('user_id', $user->id)
            ->first();

        if (! $account?->isActive()) {
            throw new AuthorizationException('Your member portal account is not active.');
        }

        if ($account->member === null || $account->member->tenant_id !== $user->tenant_id) {
            throw new AuthorizationException('Your member portal account is not linked correctly.');
        }

        return $account;
    }
}
