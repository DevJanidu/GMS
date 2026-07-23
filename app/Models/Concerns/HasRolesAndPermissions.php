<?php

namespace App\Models\Concerns;

use App\Models\Branch;
use App\Models\Role;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Base authorization building blocks shared by every policy: role and
 * permission assignment plus the checks policies delegate to.
 */
trait HasRolesAndPermissions
{
    /**
     * @return BelongsToMany<Role, $this>
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_user');
    }

    /**
     * @return BelongsToMany<Branch, $this>
     */
    public function branches(): BelongsToMany
    {
        return $this->belongsToMany(Branch::class, 'user_branch')
            ->withPivot('is_primary')
            ->withTimestamps();
    }

    public function hasRole(string $slug): bool
    {
        return $this->roles()->where('slug', $slug)->exists();
    }

    public function hasPermission(string $slug): bool
    {
        return $this->roles()
            ->whereHas('permissions', fn ($query) => $query->where('slug', $slug))
            ->exists();
    }

    public function isAssignedToBranch(int $branchId): bool
    {
        return $this->branches()->whereKey($branchId)->exists();
    }

    /**
     * Permission slugs this user effectively holds, for consumption by the
     * frontend permission gate. The "owner" role bypasses every check (see
     * AuthorizationServiceProvider), so it is represented as a wildcard
     * rather than the full permission list.
     *
     * @return list<string>
     */
    public function permissionSlugs(): array
    {
        if ($this->hasRole('owner')) {
            return ['*'];
        }

        return array_values($this->roles()
            ->with('permissions')
            ->get()
            ->flatMap(fn ($role) => $role->permissions->pluck('slug'))
            ->unique()
            ->all());
    }
}
