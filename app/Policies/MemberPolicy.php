<?php

namespace App\Policies;

use App\Models\Member;
use App\Models\User;
use App\Policies\Concerns\AuthorizesViaPermissions;

class MemberPolicy
{
    use AuthorizesViaPermissions;

    public function viewAny(User $user): bool
    {
        return $this->authorizeViaPermission($user, 'members.view');
    }

    public function view(User $user, Member $member): bool
    {
        return $this->authorizeViaPermission($user, 'members.view');
    }

    public function create(User $user): bool
    {
        return $this->authorizeViaPermission($user, 'members.create');
    }

    public function update(User $user, Member $member): bool
    {
        return $this->authorizeViaPermission($user, 'members.update');
    }

    public function delete(User $user, Member $member): bool
    {
        return $this->authorizeViaPermission($user, 'members.archive');
    }
}
