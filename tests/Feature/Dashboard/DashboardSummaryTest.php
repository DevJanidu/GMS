<?php

use App\Models\Branch;
use App\Models\Member;
use App\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\InteractsWithPermissions;

uses(RefreshDatabase::class, InteractsWithPermissions::class);

it('rejects unauthenticated requests', function () {
    $this->getJson('/api/v1/dashboard/summary')->assertUnauthorized();
});

it('denies access without the dashboard.view permission', function () {
    $tenant = Tenant::factory()->create();
    $user = $this->userWithPermissions($tenant, []);

    $this->actingAs($user)->getJson('/api/v1/dashboard/summary')->assertForbidden();
});

it('reports real active and new member counts for an owner', function () {
    $tenant = Tenant::factory()->create(['currency' => 'USD']);
    $branch = Branch::factory()->for($tenant)->create();
    $owner = $this->ownerUser($tenant);

    Member::factory()->for($tenant)->for($branch)->count(3)->create([
        'joined_at' => now()->toDateString(),
    ]);
    Member::factory()->for($tenant)->for($branch)->inactive()->create([
        'joined_at' => now()->subYears(2)->toDateString(),
    ]);

    $response = $this->actingAs($owner)->getJson('/api/v1/dashboard/summary');

    $response->assertOk();
    $response->assertJsonPath('data.members.active.status', 'available');
    $response->assertJsonPath('data.members.active.data.count', 3);
    $response->assertJsonPath('data.members.new.status', 'available');
    $response->assertJsonPath('data.members.new.data.count', 3);
    $response->assertJsonPath('data.meta.currency', 'USD');
});

it('reports real membership and billing sections now that both modules have landed', function () {
    $tenant = Tenant::factory()->create();
    $owner = $this->ownerUser($tenant);

    $response = $this->actingAs($owner)->getJson('/api/v1/dashboard/summary');

    $response->assertOk();
    $response->assertJsonPath('data.members.expiring.status', 'available');
    $response->assertJsonPath('data.members.expired.status', 'available');
    $response->assertJsonPath('data.renewalSummary.status', 'available');
    $response->assertJsonPath('data.financials.revenue.status', 'available');
    $response->assertJsonPath('data.financials.outstanding.status', 'available');
    $response->assertJsonPath('data.recentPayments.status', 'available');
});

it('restricts financial sections for a user without dashboard.financials.view', function () {
    $tenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($tenant)->create();
    $user = $this->userWithPermissions($tenant, ['dashboard.view']);
    $user->branches()->attach($branch, ['is_primary' => true]);

    $response = $this->actingAs($user)->getJson('/api/v1/dashboard/summary');

    $response->assertOk();
    $response->assertJsonPath('data.financials.revenue.status', 'restricted');
    $response->assertJsonPath('data.financials.outstanding.status', 'restricted');
    $response->assertJsonPath('data.recentPayments.status', 'restricted');
    $response->assertJsonPath('data.branchComparison.data.0.revenue', null);
});

it('grants financial sections for a user with dashboard.financials.view', function () {
    $tenant = Tenant::factory()->create();
    $user = $this->userWithPermissions($tenant, ['dashboard.view', 'dashboard.financials.view']);

    $response = $this->actingAs($user)->getJson('/api/v1/dashboard/summary');

    $response->assertOk();
    $response->assertJsonPath('data.financials.revenue.status', 'available');
    $response->assertJsonPath('data.recentPayments.status', 'available');
});

it('rejects a branch filter the user is not assigned to', function () {
    $tenant = Tenant::factory()->create();
    $ownBranch = Branch::factory()->for($tenant)->create();
    $otherBranch = Branch::factory()->for($tenant)->create();
    $user = $this->userWithPermissions($tenant, ['dashboard.view']);
    $user->branches()->attach($ownBranch, ['is_primary' => true]);

    $this->actingAs($user)
        ->getJson("/api/v1/dashboard/summary?branch_id={$otherBranch->id}")
        ->assertForbidden();
});

it('scopes member counts to the branches a non-owner user is assigned to', function () {
    $tenant = Tenant::factory()->create();
    $assignedBranch = Branch::factory()->for($tenant)->create();
    $otherBranch = Branch::factory()->for($tenant)->create();
    $user = $this->userWithPermissions($tenant, ['dashboard.view']);
    $user->branches()->attach($assignedBranch, ['is_primary' => true]);

    Member::factory()->for($tenant)->for($assignedBranch)->count(2)->create();
    Member::factory()->for($tenant)->for($otherBranch)->count(5)->create();

    $response = $this->actingAs($user)->getJson('/api/v1/dashboard/summary');

    $response->assertOk();
    $response->assertJsonPath('data.members.active.data.count', 2);
    $response->assertJsonCount(1, 'data.branchComparison.data');
});

it('does not leak members from another tenant into the summary', function () {
    $tenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($tenant)->create();
    $owner = $this->ownerUser($tenant);
    Member::factory()->for($tenant)->for($branch)->create();

    $otherTenant = Tenant::factory()->create();
    $otherBranch = Branch::factory()->for($otherTenant)->create();
    Member::factory()->for($otherTenant)->for($otherBranch)->count(10)->create();

    $response = $this->actingAs($owner)->getJson('/api/v1/dashboard/summary');

    $response->assertOk();
    $response->assertJsonPath('data.members.active.data.count', 1);
});

it('returns branch filter options scoped to the current user', function () {
    $tenant = Tenant::factory()->create();
    $assignedBranch = Branch::factory()->for($tenant)->create();
    Branch::factory()->for($tenant)->create();
    $user = $this->userWithPermissions($tenant, ['dashboard.view']);
    $user->branches()->attach($assignedBranch, ['is_primary' => true]);

    $response = $this->actingAs($user)->getJson('/api/v1/dashboard/filters');

    $response->assertOk();
    $response->assertJsonCount(1, 'data.branches');
    $response->assertJsonPath('data.branches.0.id', $assignedBranch->id);
});
