<?php

namespace App\Modules\Audit\Services;

use App\Models\Branch;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;

final class AuditAuthorizer
{
    /** @return list<int> */
    public function branches(User $user, string $permission): array
    {
        if (! $user->hasRole('owner') && ! $user->hasPermission($permission)) {
            throw new AuthorizationException('You do not have permission to access audit logs.');
        }

        return $user->hasRole('owner')
            ? array_values(Branch::query()->pluck('id')->map(fn ($id) => (int) $id)->all())
            : array_values($user->branches()->pluck('branches.id')->map(fn ($id) => (int) $id)->all());
    }
}
