<?php

use App\Models\Permission;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('denies access to a user without the plans.view permission', function () {
    $tenant = Tenant::factory()->create();
    $user = User::factory()->create(['tenant_id' => $tenant->id]);

    $this->actingAs($user)->get(route('plans.index'))->assertForbidden();
});

it('allows a user whose role grants plans.view but blocks create', function () {
    $tenant = Tenant::factory()->create();
    $user = User::factory()->create(['tenant_id' => $tenant->id]);
    $role = Role::factory()->create(['tenant_id' => $tenant->id, 'slug' => 'front-desk']);
    $role->permissions()->attach(Permission::factory()->create(['slug' => 'plans.view']));
    $user->roles()->attach($role);

    $this->actingAs($user)->get(route('plans.index'))->assertOk();
    $this->actingAs($user)->get(route('plans.create'))->assertForbidden();
});
