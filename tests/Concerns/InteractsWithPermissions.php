<?php

namespace Tests\Concerns;

use App\Models\Permission;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\User;

trait InteractsWithPermissions
{
    /**
     * Create a user in the given tenant holding a custom role with exactly
     * the given permission slugs (creating any that don't exist yet).
     *
     * @param  list<string>  $slugs
     */
    protected function userWithPermissions(Tenant $tenant, array $slugs = []): User
    {
        $user = User::factory()->create(['tenant_id' => $tenant->id]);

        $role = Role::factory()->create(['tenant_id' => $tenant->id]);

        $permissions = collect($slugs)->map(
            fn (string $slug) => Permission::query()->firstOrCreate(['slug' => $slug], ['name' => $slug])
        );

        $role->permissions()->sync($permissions->pluck('id'));
        $user->roles()->attach($role);

        return $user;
    }

    protected function ownerUser(Tenant $tenant): User
    {
        $user = User::factory()->create(['tenant_id' => $tenant->id]);

        $owner = Role::query()->firstOrCreate(
            ['tenant_id' => null, 'slug' => 'owner'],
            ['name' => 'Owner', 'is_system' => true],
        );

        $user->roles()->attach($owner);

        return $user;
    }
}
