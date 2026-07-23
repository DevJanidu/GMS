<?php

namespace App\Modules\Gym\Support;

use App\Models\User;
use App\Policies\Concerns\AuthorizesViaPermissions;

/**
 * Gym settings are a per-tenant singleton (no {gymProfile} route
 * parameter to authorize against), so these are plain gate abilities
 * rather than a model policy.
 */
class GymProfileGate
{
    use AuthorizesViaPermissions;

    public function view(User $user): bool
    {
        return $this->authorizeViaPermission($user, 'gym.view');
    }

    public function update(User $user): bool
    {
        return $this->authorizeViaPermission($user, 'gym.update');
    }
}
