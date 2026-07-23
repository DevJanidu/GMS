<?php

namespace App\Modules\Membership\Policies;

use App\Models\User;
use App\Modules\Membership\Models\Membership;
use App\Policies\Concerns\AuthorizesViaPermissions;

class MembershipPolicy
{
    use AuthorizesViaPermissions;

    public function viewAny(User $user): bool
    {
        return $this->authorizeViaPermission($user, 'memberships.view');
    }

    public function view(User $user, Membership $membership): bool
    {
        return $this->authorizeViaPermission($user, 'memberships.view');
    }

    public function sell(User $user): bool
    {
        return $this->authorizeViaPermission($user, 'memberships.sell');
    }

    public function renew(User $user, Membership $membership): bool
    {
        return $this->authorizeViaPermission($user, 'memberships.renew');
    }

    public function freeze(User $user, Membership $membership): bool
    {
        return $this->authorizeViaPermission($user, 'memberships.freeze');
    }

    public function resume(User $user, Membership $membership): bool
    {
        return $this->authorizeViaPermission($user, 'memberships.freeze');
    }

    public function suspend(User $user, Membership $membership): bool
    {
        return $this->authorizeViaPermission($user, 'memberships.suspend');
    }

    public function cancel(User $user, Membership $membership): bool
    {
        return $this->authorizeViaPermission($user, 'memberships.cancel');
    }

    public function reactivate(User $user, Membership $membership): bool
    {
        return $this->authorizeViaPermission($user, 'memberships.reactivate');
    }

    public function remind(User $user): bool
    {
        return $this->authorizeViaPermission($user, 'memberships.view');
    }
}
