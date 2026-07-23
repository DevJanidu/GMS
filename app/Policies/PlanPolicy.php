<?php

namespace App\Policies;

use App\Models\Plan;
use App\Models\User;
use App\Policies\Concerns\AuthorizesViaPermissions;

class PlanPolicy
{
    use AuthorizesViaPermissions;

    public function viewAny(User $user): bool
    {
        return $this->authorizeViaPermission($user, 'plans.view');
    }

    public function view(User $user, Plan $plan): bool
    {
        return $this->authorizeViaPermission($user, 'plans.view');
    }

    public function create(User $user): bool
    {
        return $this->authorizeViaPermission($user, 'plans.create');
    }

    public function update(User $user, Plan $plan): bool
    {
        return $this->authorizeViaPermission($user, 'plans.update');
    }

    public function delete(User $user, Plan $plan): bool
    {
        return $this->authorizeViaPermission($user, 'plans.delete');
    }
}
