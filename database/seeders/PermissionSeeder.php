<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Modules\AccessControl\Support\PermissionCatalog;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        foreach (PermissionCatalog::all() as $group => $permissions) {
            foreach ($permissions as $slug => $name) {
                Permission::query()->updateOrCreate(
                    ['slug' => $slug],
                    ['name' => $name, 'group' => $group, 'description' => $name]
                );
            }
        }
    }
}
