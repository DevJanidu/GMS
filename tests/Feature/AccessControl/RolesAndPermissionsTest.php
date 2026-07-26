<?php

use App\Models\Permission;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('reports hasRole and hasPermission based on assigned roles', function () {
    $user = User::factory()->create();
    $role = Role::factory()->create(['slug' => 'manager']);
    $permission = Permission::factory()->create(['slug' => 'branches.view']);

    $role->permissions()->attach($permission);
    $user->roles()->attach($role);

    expect($user->hasRole('manager'))->toBeTrue();
    expect($user->hasRole('owner'))->toBeFalse();
    expect($user->hasPermission('branches.view'))->toBeTrue();
    expect($user->hasPermission('branches.delete'))->toBeFalse();
});

it('lets the owner role bypass every gate check', function () {
    $user = User::factory()->create();
    $ownerRole = Role::factory()->system()->create(['slug' => 'owner']);
    $user->roles()->attach($ownerRole);

    expect($user->can('anything.at.all'))->toBeTrue();
});

it('reports a wildcard permission slug for the owner role', function () {
    $user = User::factory()->create();
    $ownerRole = Role::factory()->system()->create(['slug' => 'owner']);
    $user->roles()->attach($ownerRole);

    expect($user->permissionSlugs())->toBe(['*']);
});

it('reports the union of permission slugs across a non-owner user roles', function () {
    $user = User::factory()->create();
    $roleA = Role::factory()->create();
    $roleB = Role::factory()->create();
    $viewPermission = Permission::factory()->create(['slug' => 'branches.view']);
    $updatePermission = Permission::factory()->create(['slug' => 'branches.update']);

    $roleA->permissions()->attach($viewPermission);
    $roleB->permissions()->attach([$viewPermission->id, $updatePermission->id]);
    $user->roles()->attach([$roleA->id, $roleB->id]);

    expect($user->permissionSlugs())->toEqualCanonicalizing([
        'branches.view',
        'branches.update',
    ]);
});

it('reports no permission slugs for a user with no roles', function () {
    $user = User::factory()->create();

    expect($user->permissionSlugs())->toBe([]);
});

it('scopes visible roles to a tenant plus global system roles', function () {
    $tenantA = Tenant::factory()->create();
    $tenantB = Tenant::factory()->create();

    $systemRole = Role::factory()->system()->create();
    $tenantARole = Role::factory()->create(['tenant_id' => $tenantA->id]);
    Role::factory()->create(['tenant_id' => $tenantB->id]);

    $visible = Role::visibleToTenant($tenantA->id)->get();

    expect($visible->pluck('id'))->toContain($systemRole->id, $tenantARole->id);
    expect($visible)->toHaveCount(2);
});
