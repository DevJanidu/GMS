<?php

use App\Models\Permission;
use App\Models\Role;
use App\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\InteractsWithPermissions;

uses(RefreshDatabase::class, InteractsWithPermissions::class);

it('lists system roles plus the tenant own custom roles', function () {
    $tenant = Tenant::factory()->create();
    $otherTenant = Tenant::factory()->create();

    // userWithPermissions() creates and attaches a role of its own, so the
    // tenant already has one custom role before this test adds its own.
    $user = $this->userWithPermissions($tenant, ['roles.view']);

    Role::factory()->system()->create();
    $ownRole = Role::factory()->create(['tenant_id' => $tenant->id]);
    Role::factory()->create(['tenant_id' => $otherTenant->id]);

    $response = $this->actingAs($user)->getJson('/api/v1/roles');

    $response->assertOk();
    expect($response->json('data'))->toHaveCount(3);
    expect(collect($response->json('data'))->pluck('id'))->toContain($ownRole->id);
});

it('creates a custom role with permissions', function () {
    $tenant = Tenant::factory()->create();
    $permission = Permission::factory()->create(['slug' => 'branches.view']);
    $user = $this->userWithPermissions($tenant, ['roles.create']);

    $response = $this->actingAs($user)->postJson('/api/v1/roles', [
        'name' => 'Front Desk Lead',
        'permissions' => [$permission->id],
    ]);

    $response->assertCreated();
    $response->assertJsonPath('data.name', 'Front Desk Lead');
    $response->assertJsonCount(1, 'data.permissions');

    $role = Role::where('name', 'Front Desk Lead')->first();
    expect($role->tenant_id)->toBe($tenant->id);
    expect($role->is_system)->toBeFalse();
});

it('prevents updating the owner role', function () {
    $tenant = Tenant::factory()->create();
    $ownerRole = Role::factory()->system()->create(['slug' => 'owner']);
    $user = $this->userWithPermissions($tenant, ['roles.update']);

    $response = $this->actingAs($user)->putJson("/api/v1/roles/{$ownerRole->id}", [
        'name' => 'Hacked Name',
    ]);

    $response->assertForbidden();
});

it('allows updating permissions on a non-owner system role, but keeps its name fixed', function () {
    $tenant = Tenant::factory()->create();
    $systemRole = Role::factory()->system()->create(['name' => 'Manager']);
    $permission = Permission::factory()->create();
    $user = $this->userWithPermissions($tenant, ['roles.update']);

    $response = $this->actingAs($user)->putJson("/api/v1/roles/{$systemRole->id}", [
        'name' => 'Hacked Name',
        'permissions' => [$permission->id],
    ]);

    $response->assertOk();
    expect($systemRole->fresh()->name)->toBe('Manager');
    expect($systemRole->fresh()->permissions->pluck('id'))->toEqual(collect([$permission->id]));
});

it('prevents even an owner user from modifying the owner role, despite the Gate::before bypass', function () {
    $tenant = Tenant::factory()->create();
    $ownerRole = Role::query()->firstOrCreate(
        ['tenant_id' => null, 'slug' => 'owner'],
        ['name' => 'Owner', 'is_system' => true],
    );
    $user = $this->ownerUser($tenant);

    $response = $this->actingAs($user)->putJson("/api/v1/roles/{$ownerRole->id}", [
        'permissions' => [],
    ]);

    $response->assertForbidden();
});

it('prevents even an owner user from deleting a system role, despite the Gate::before bypass', function () {
    $tenant = Tenant::factory()->create();
    $systemRole = Role::factory()->system()->create();
    $user = $this->ownerUser($tenant);

    $this->actingAs($user)->deleteJson("/api/v1/roles/{$systemRole->id}")->assertForbidden();

    expect(Role::find($systemRole->id))->not->toBeNull();
});

it('serialises role permissions as a plain array, not a wrapped collection', function () {
    // Regression: PermissionResource::collection(...) nested inside
    // RoleResource's own toArray() serializes as {"data": [...]} once
    // JSON-encoded outside a top-level resource response, but the frontend
    // expects permissions to be a plain array and indexes it directly.
    $tenant = Tenant::factory()->create();
    $permissionA = Permission::factory()->create(['slug' => 'branches.view']);
    $permissionB = Permission::factory()->create(['slug' => 'branches.update']);
    $role = Role::factory()->create(['tenant_id' => $tenant->id]);
    $role->permissions()->attach([$permissionA->id, $permissionB->id]);
    $user = $this->userWithPermissions($tenant, ['roles.view']);

    $response = $this->actingAs($user)->getJson("/api/v1/roles/{$role->id}");

    $response->assertOk();
    expect($response->json('data.permissions'))->toBeArray();
    $response->assertJsonCount(2, 'data.permissions');
    expect(collect($response->json('data.permissions'))->pluck('id'))
        ->toContain($permissionA->id, $permissionB->id);
});

it('prevents deleting a system role', function () {
    $tenant = Tenant::factory()->create();
    $systemRole = Role::factory()->system()->create();
    $user = $this->userWithPermissions($tenant, ['roles.delete']);

    $this->actingAs($user)->deleteJson("/api/v1/roles/{$systemRole->id}")->assertForbidden();
});

it('prevents modifying another tenant custom role', function () {
    $tenant = Tenant::factory()->create();
    $otherTenant = Tenant::factory()->create();
    $otherRole = Role::factory()->create(['tenant_id' => $otherTenant->id]);

    $user = $this->userWithPermissions($tenant, ['roles.update']);

    $this->actingAs($user)->putJson("/api/v1/roles/{$otherRole->id}", ['name' => 'x'])->assertForbidden();
});

it('updates permission assignment on a custom role', function () {
    $tenant = Tenant::factory()->create();
    $role = Role::factory()->create(['tenant_id' => $tenant->id]);
    $permission = Permission::factory()->create();
    $user = $this->userWithPermissions($tenant, ['roles.update']);

    $response = $this->actingAs($user)->putJson("/api/v1/roles/{$role->id}", [
        'permissions' => [$permission->id],
    ]);

    $response->assertOk();
    expect($role->fresh()->permissions->pluck('id'))->toEqual(collect([$permission->id]));
});

it('deletes a custom role', function () {
    $tenant = Tenant::factory()->create();
    $role = Role::factory()->create(['tenant_id' => $tenant->id]);
    $user = $this->userWithPermissions($tenant, ['roles.delete']);

    $this->actingAs($user)->deleteJson("/api/v1/roles/{$role->id}")->assertOk();

    expect(Role::find($role->id))->toBeNull();
});

it('lists the permission catalog', function () {
    $tenant = Tenant::factory()->create();
    $user = $this->userWithPermissions($tenant, ['roles.view']);
    Permission::factory()->count(3)->create();

    $response = $this->actingAs($user)->getJson('/api/v1/permissions');

    $response->assertOk();
    // 3 created here + the "roles.view" permission created by the helper.
    expect($response->json('data'))->toHaveCount(4);
});
