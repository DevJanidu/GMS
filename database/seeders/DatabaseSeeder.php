<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // PermissionSeeder/RoleSeeder create the full permission catalog and
        // the system roles (owner/manager/front-desk) that every module's
        // policies and the frontend nav filter rely on. Without this, only
        // the owner role (which bypasses Gate checks entirely) would work.
        $this->call([
            PermissionSeeder::class,
            RoleSeeder::class,
        ]);

        $tenant = Tenant::factory()->create([
            'name' => 'Demo Gym',
            'slug' => 'demo-gym',
        ]);

        $branch = Branch::factory()->for($tenant)->create([
            'name' => 'Main Branch',
            'code' => 'MAIN',
        ]);

        $user = User::factory()->create([
            'tenant_id' => $tenant->id,
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'password' => 'password123',
        ]);

        $user->branches()->attach($branch, ['is_primary' => true]);

        $owner = Role::query()->whereNull('tenant_id')->where('slug', 'owner')->firstOrFail();

        $user->roles()->syncWithoutDetaching([$owner->id]);
    }
}
