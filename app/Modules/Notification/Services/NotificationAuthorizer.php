<?php

namespace App\Modules\Notification\Services;

use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;

final class NotificationAuthorizer
{
    public function authorize(User $user, string $permission, ?int $branchId = null): void
    {
        if (! $user->hasRole('owner') && ! $user->hasPermission($permission)) {
            throw new AuthorizationException('You do not have permission to perform this notification action.');
        }

        if ($branchId !== null && ! $user->hasRole('owner') && ! $user->isAssignedToBranch($branchId)) {
            throw new AuthorizationException('You do not have access to this branch.');
        }
    }
}
