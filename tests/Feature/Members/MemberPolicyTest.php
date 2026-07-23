<?php

use App\Models\Member;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('denies access to a user without the members.view permission', function () {
    $tenant = Tenant::factory()->create();
    $user = User::factory()->create(['tenant_id' => $tenant->id]);

    $this->actingAs($user)->get(route('members.index'))->assertForbidden();
});

it('allows a user whose role grants members.view but blocks create', function () {
    $tenant = Tenant::factory()->create();
    $user = User::factory()->create(['tenant_id' => $tenant->id]);
    $role = Role::factory()->create(['tenant_id' => $tenant->id, 'slug' => 'front-desk']);
    $role->permissions()->attach(Permission::factory()->create(['slug' => 'members.view']));
    $user->roles()->attach($role);

    $this->actingAs($user)->get(route('members.index'))->assertOk();
    $this->actingAs($user)->get(route('members.create'))->assertForbidden();
});

it('lets the owner role manage members without explicit permissions', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $member = Member::factory()->for($tenant)->create();

    $this->actingAs($user)->get(route('members.create'))->assertOk();
    $this->actingAs($user)->get(route('members.edit', $member))->assertOk();
});
