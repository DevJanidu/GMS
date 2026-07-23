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
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $user->branches()->attach($branch, ['is_primary' => true]);
        $user->roles()->attach(Role::query()->whereNull('tenant_id')->where('slug', 'owner')->first());
    }
}
