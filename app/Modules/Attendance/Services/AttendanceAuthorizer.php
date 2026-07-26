<?php

namespace App\Modules\Attendance\Services;

use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;

class AttendanceAuthorizer
{
    public function authorize(User $user, string $permission, ?int $branchId = null): void
    {
        if (! $user->hasRole('owner') && ! $user->hasPermission($permission)) {
            throw new AuthorizationException("Missing attendance permission: {$permission}.");
        }

        if ($branchId && ! $user->hasRole('owner') && ! $user->isAssignedToBranch($branchId)) {
            throw new AuthorizationException('The attendance record belongs to an unassigned branch.');
        }
    }
}
