<?php

namespace App\Modules\Branch\Policies;

use App\Models\Branch;
use App\Models\User;
use App\Policies\Concerns\AuthorizesViaPermissions;

class BranchPolicy
{
    use AuthorizesViaPermissions;

    public function viewAny(User $user): bool
    {
        return $this->authorizeViaPermission($user, 'branches.view');
    }

    public function view(User $user, Branch $branch): bool
    {
        return $this->authorizeViaPermission($user, 'branches.view')
            && $branch->tenant_id === $user->tenant_id;
    }

    public function create(User $user): bool
    {
        return $this->authorizeViaPermission($user, 'branches.create');
    }

    public function update(User $user, Branch $branch): bool
    {
        return $this->authorizeViaPermission($user, 'branches.update')
            && $branch->tenant_id === $user->tenant_id;
    }

    public function delete(User $user, Branch $branch): bool
    {
        return $this->authorizeViaPermission($user, 'branches.delete')
            && $branch->tenant_id === $user->tenant_id;
    }
}
