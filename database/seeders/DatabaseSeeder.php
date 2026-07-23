<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Permission;
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

        // Owner bypasses every Gate check (see AuthorizationServiceProvider),
        // so it needs no explicit permissions to unblock the demo account.
        // Full role/permission management belongs to the Staff & RBAC module;
        // these rows only keep every module's policies satisfiable until then.
        $owner = Role::firstOrCreate(
            ['tenant_id' => null, 'slug' => 'owner'],
            ['name' => 'Owner', 'is_system' => true],
        );

        $user->roles()->syncWithoutDetaching([$owner->id]);

        collect([
            ['name' => 'View members', 'slug' => 'members.view', 'group' => 'members'],
            ['name' => 'Create members', 'slug' => 'members.create', 'group' => 'members'],
            ['name' => 'Update members', 'slug' => 'members.update', 'group' => 'members'],
            ['name' => 'Archive members', 'slug' => 'members.archive', 'group' => 'members'],
            ['name' => 'View plans', 'slug' => 'plans.view', 'group' => 'plans'],
            ['name' => 'Create plans', 'slug' => 'plans.create', 'group' => 'plans'],
            ['name' => 'Update plans', 'slug' => 'plans.update', 'group' => 'plans'],
            ['name' => 'Delete plans', 'slug' => 'plans.delete', 'group' => 'plans'],
            ['name' => 'View memberships', 'slug' => 'memberships.view', 'group' => 'memberships'],
            ['name' => 'Sell memberships', 'slug' => 'memberships.sell', 'group' => 'memberships'],
            ['name' => 'Renew memberships', 'slug' => 'memberships.renew', 'group' => 'memberships'],
            ['name' => 'Freeze memberships', 'slug' => 'memberships.freeze', 'group' => 'memberships'],
            ['name' => 'Suspend memberships', 'slug' => 'memberships.suspend', 'group' => 'memberships'],
            ['name' => 'Cancel memberships', 'slug' => 'memberships.cancel', 'group' => 'memberships'],
            ['name' => 'Reactivate memberships', 'slug' => 'memberships.reactivate', 'group' => 'memberships'],
        ])->each(fn (array $permission) => Permission::firstOrCreate(['slug' => $permission['slug']], $permission));
    }
}
