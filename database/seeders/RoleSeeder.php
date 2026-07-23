<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Modules\AccessControl\Support\PermissionCatalog;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $allSlugs = PermissionCatalog::slugs();

        $this->systemRole('owner', 'Owner', $allSlugs);

        $this->systemRole('manager', 'Manager', [
            'gym.view',
            'branches.view', 'branches.update',
            'staff.view', 'staff.create', 'staff.update', 'staff.suspend', 'staff.assign-branches',
            'roles.view',
        ]);

        $this->systemRole('front-desk', 'Front Desk', [
            'branches.view',
            'staff.view',
        ]);
    }

    /**
     * @param  list<string>  $slugs
     */
    private function systemRole(string $slug, string $name, array $slugs): void
    {
        $role = Role::query()->updateOrCreate(
            ['tenant_id' => null, 'slug' => $slug],
            ['name' => $name, 'is_system' => true]
        );

        $permissionIds = Permission::query()->whereIn('slug', $slugs)->pluck('id');

        $role->permissions()->sync($permissionIds);
    }
}
