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

it('prevents updating a system role', function () {
    $tenant = Tenant::factory()->create();
    $systemRole = Role::factory()->system()->create();
    $user = $this->userWithPermissions($tenant, ['roles.update']);

    $response = $this->actingAs($user)->putJson("/api/v1/roles/{$systemRole->id}", [
        'name' => 'Hacked Name',
    ]);

    $response->assertForbidden();
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
