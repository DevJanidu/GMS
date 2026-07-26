<?php

namespace App\Modules\Staff\Policies;

use App\Models\User;
use App\Policies\Concerns\AuthorizesViaPermissions;

class StaffPolicy
{
    use AuthorizesViaPermissions;

    public function viewAny(User $user): bool
    {
        return $this->authorizeViaPermission($user, 'staff.view');
    }

    public function view(User $user, User $staff): bool
    {
        return $this->authorizeViaPermission($user, 'staff.view')
            && $staff->tenant_id === $user->tenant_id;
    }

    public function create(User $user): bool
    {
        return $this->authorizeViaPermission($user, 'staff.create');
    }

    public function update(User $user, User $staff): bool
    {
        return $this->authorizeViaPermission($user, 'staff.update')
            && $staff->tenant_id === $user->tenant_id;
    }

    public function delete(User $user, User $staff): bool
    {
        return $this->authorizeViaPermission($user, 'staff.delete')
            && $staff->tenant_id === $user->tenant_id
            && $staff->isNot($user);
    }

    public function suspend(User $user, User $staff): bool
    {
        return $this->authorizeViaPermission($user, 'staff.suspend')
            && $staff->tenant_id === $user->tenant_id
            && $staff->isNot($user);
    }

    public function assignBranches(User $user, User $staff): bool
    {
        return $this->authorizeViaPermission($user, 'staff.assign-branches')
            && $staff->tenant_id === $user->tenant_id;
    }
}
