<?php

namespace App\Modules\AccessControl\Policies;

use App\Models\Role;
use App\Models\User;
use App\Policies\Concerns\AuthorizesViaPermissions;

class RolePolicy
{
    use AuthorizesViaPermissions;

    public function viewAny(User $user): bool
    {
        return $this->authorizeViaPermission($user, 'roles.view');
    }

    public function view(User $user, Role $role): bool
    {
        return $this->authorizeViaPermission($user, 'roles.view')
            && ($role->tenant_id === null || $role->tenant_id === $user->tenant_id);
    }

    public function create(User $user): bool
    {
        return $this->authorizeViaPermission($user, 'roles.create');
    }

    public function update(User $user, Role $role): bool
    {
        return $this->authorizeViaPermission($user, 'roles.update')
            && ! $role->is_system
            && $role->tenant_id === $user->tenant_id;
    }

    public function delete(User $user, Role $role): bool
    {
        return $this->authorizeViaPermission($user, 'roles.delete')
            && ! $role->is_system
            && $role->tenant_id === $user->tenant_id;
    }
}
