<?php

use App\Models\Branch;
use App\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\InteractsWithPermissions;

uses(RefreshDatabase::class, InteractsWithPermissions::class);

it('lists only branches for the current tenant', function () {
    $tenant = Tenant::factory()->create();
    $otherTenant = Tenant::factory()->create();

    Branch::factory()->for($tenant)->count(2)->create();
    Branch::factory()->for($otherTenant)->create();

    $user = $this->userWithPermissions($tenant, ['branches.view']);

    $response = $this->actingAs($user)->getJson('/api/v1/branches');

    $response->assertOk();
    expect($response->json('data'))->toHaveCount(2);
});

it('denies listing branches without the branches.view permission', function () {
    $tenant = Tenant::factory()->create();
    $user = $this->userWithPermissions($tenant, []);

    $this->actingAs($user)->getJson('/api/v1/branches')->assertForbidden();
});

it('creates a branch scoped to the acting user tenant', function () {
    $tenant = Tenant::factory()->create();
    $user = $this->userWithPermissions($tenant, ['branches.create']);

    $response = $this->actingAs($user)->postJson('/api/v1/branches', [
        'name' => 'Downtown Branch',
        'code' => 'DT01',
        'address' => '123 Main St',
    ]);

    $response->assertCreated();
    $response->assertJsonPath('data.name', 'Downtown Branch');

    $branch = Branch::withoutGlobalScopes()->where('code', 'DT01')->first();
    expect($branch->tenant_id)->toBe($tenant->id);
});

it('rejects a duplicate branch code within the same tenant', function () {
    $tenant = Tenant::factory()->create();
    $user = $this->userWithPermissions($tenant, ['branches.create']);
    Branch::factory()->for($tenant)->create(['code' => 'DT01']);

    $response = $this->actingAs($user)->postJson('/api/v1/branches', [
        'name' => 'Another Branch',
        'code' => 'DT01',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('code');
});

it('allows the same branch code across different tenants', function () {
    $tenant = Tenant::factory()->create();
    $otherTenant = Tenant::factory()->create();
    Branch::factory()->for($otherTenant)->create(['code' => 'DT01']);

    $user = $this->userWithPermissions($tenant, ['branches.create']);

    $response = $this->actingAs($user)->postJson('/api/v1/branches', [
        'name' => 'Downtown Branch',
        'code' => 'DT01',
    ]);

    $response->assertCreated();
});

it('returns 404 for a branch belonging to another tenant', function () {
    $tenant = Tenant::factory()->create();
    $otherTenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($otherTenant)->create();

    $user = $this->userWithPermissions($tenant, ['branches.view']);

    $this->actingAs($user)->getJson("/api/v1/branches/{$branch->id}")->assertNotFound();
});

it('updates a branch', function () {
    $tenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($tenant)->create();
    $user = $this->userWithPermissions($tenant, ['branches.update']);

    $response = $this->actingAs($user)->putJson("/api/v1/branches/{$branch->id}", [
        'name' => 'Renamed Branch',
    ]);

    $response->assertOk();
    $response->assertJsonPath('data.name', 'Renamed Branch');
});

it('deletes a branch', function () {
    $tenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($tenant)->create();
    $user = $this->userWithPermissions($tenant, ['branches.delete']);

    $this->actingAs($user)->deleteJson("/api/v1/branches/{$branch->id}")->assertOk();

    expect(Branch::withoutGlobalScopes()->find($branch->id))->toBeNull();
});

it('updates branch opening hours', function () {
    $tenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($tenant)->create();
    $user = $this->userWithPermissions($tenant, ['branches.update']);

    $response = $this->actingAs($user)->putJson("/api/v1/branches/{$branch->id}/opening-hours", [
        'opening_hours' => [
            'monday' => ['open' => '06:00', 'close' => '22:00', 'closed' => false],
            'sunday' => ['closed' => true],
        ],
    ]);

    $response->assertOk();
    $response->assertJsonPath('data.opening_hours.monday.open', '06:00');
    $response->assertJsonPath('data.opening_hours.sunday.closed', true);
});

it('rejects opening hours missing open/close for a non-closed day', function () {
    $tenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($tenant)->create();
    $user = $this->userWithPermissions($tenant, ['branches.update']);

    $response = $this->actingAs($user)->putJson("/api/v1/branches/{$branch->id}/opening-hours", [
        'opening_hours' => [
            'monday' => ['closed' => false],
        ],
    ]);

    $response->assertUnprocessable();
});
