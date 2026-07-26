<?php

namespace App\Policies\Concerns;

use App\Models\User;

/**
 * Base authorization structure for module policies: every ability check
 * ultimately reduces to "does this user hold a role granting this permission
 * slug", so concrete policies (Branch, Staff, Role, ...) only need to name
 * the permission slug for each ability.
 */
trait AuthorizesViaPermissions
{
    protected function authorizeViaPermission(User $user, string $permission): bool
    {
        return $user->hasPermission($permission);
    }
}
