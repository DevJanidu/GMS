<?php

use App\Models\Branch;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\User;
use App\Modules\Staff\Notifications\StaffInvitationNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Tests\Concerns\InteractsWithPermissions;

uses(RefreshDatabase::class, InteractsWithPermissions::class);

it('lists only staff for the current tenant', function () {
    $tenant = Tenant::factory()->create();
    $otherTenant = Tenant::factory()->create();

    $user = $this->userWithPermissions($tenant, ['staff.view']);
    User::factory()->create(['tenant_id' => $otherTenant->id]);

    $response = $this->actingAs($user)->getJson('/api/v1/staff');

    $response->assertOk();
    // Only the acting user themselves (created by the helper) is visible.
    expect($response->json('data'))->toHaveCount(1);
});

it('invites a new staff member and queues the invitation email', function () {
    Notification::fake();

    $tenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($tenant)->create();
    $role = Role::factory()->create(['tenant_id' => $tenant->id]);
    $inviter = $this->userWithPermissions($tenant, ['staff.create']);

    $response = $this->actingAs($inviter)->postJson('/api/v1/staff', [
        'name' => 'New Staffer',
        'email' => 'staffer@example.com',
        'role_id' => $role->id,
        'branch_ids' => [$branch->id],
    ]);

    $response->assertCreated();
    $response->assertJsonPath('data.status', 'invited');

    $staff = User::where('email', 'staffer@example.com')->first();
    expect($staff)->not->toBeNull();
    expect($staff->tenant_id)->toBe($tenant->id);
    expect($staff->status)->toBe('invited');
    expect($staff->staffProfile)->not->toBeNull();
    expect($staff->roles->pluck('id'))->toContain($role->id);
    expect($staff->branches()->wherePivot('is_primary', true)->first()->id)->toBe($branch->id);

    Notification::assertSentTo($staff, StaffInvitationNotification::class);
});

it('rejects inviting a staff member with a duplicate email', function () {
    $tenant = Tenant::factory()->create();
    $role = Role::factory()->create(['tenant_id' => $tenant->id]);
    $inviter = $this->userWithPermissions($tenant, ['staff.create']);
    User::factory()->create(['email' => 'taken@example.com']);

    $response = $this->actingAs($inviter)->postJson('/api/v1/staff', [
        'name' => 'New Staffer',
        'email' => 'taken@example.com',
        'role_id' => $role->id,
    ]);

    $response->assertUnprocessable();
});

it('suspends a staff member and revokes their sessions', function () {
    $tenant = Tenant::factory()->create();
    $staff = User::factory()->create(['tenant_id' => $tenant->id]);
    $manager = $this->userWithPermissions($tenant, ['staff.suspend']);

    DB::table('sessions')->insert([
        'id' => 'test-session-id',
        'user_id' => $staff->id,
        'payload' => 'x',
        'last_activity' => time(),
    ]);

    $response = $this->actingAs($manager)->patchJson("/api/v1/staff/{$staff->id}/suspend");

    $response->assertOk();
    expect($staff->fresh()->status)->toBe('suspended');
    expect(DB::table('sessions')->where('user_id', $staff->id)->count())->toBe(0);
});

it('activates a suspended staff member', function () {
    $tenant = Tenant::factory()->create();
    $staff = User::factory()->suspended()->create(['tenant_id' => $tenant->id]);
    $manager = $this->userWithPermissions($tenant, ['staff.suspend']);

    $response = $this->actingAs($manager)->patchJson("/api/v1/staff/{$staff->id}/activate");

    $response->assertOk();
    expect($staff->fresh()->status)->toBe('active');
});

it('prevents a staff member from suspending themselves', function () {
    $tenant = Tenant::factory()->create();
    $manager = $this->userWithPermissions($tenant, ['staff.suspend']);

    $this->actingAs($manager)->patchJson("/api/v1/staff/{$manager->id}/suspend")->assertForbidden();
});

it('assigns branches to a staff member', function () {
    $tenant = Tenant::factory()->create();
    $staff = User::factory()->create(['tenant_id' => $tenant->id]);
    $branchA = Branch::factory()->for($tenant)->create();
    $branchB = Branch::factory()->for($tenant)->create();
    $manager = $this->userWithPermissions($tenant, ['staff.assign-branches']);

    $response = $this->actingAs($manager)->putJson("/api/v1/staff/{$staff->id}/branches", [
        'branch_ids' => [$branchA->id, $branchB->id],
        'primary_branch_id' => $branchB->id,
    ]);

    $response->assertOk();

    $staff->refresh();
    expect($staff->branches->pluck('id')->sort()->values())->toEqual(collect([$branchA->id, $branchB->id])->sort()->values());
    expect($staff->branches()->wherePivot('is_primary', true)->first()->id)->toBe($branchB->id);
});

it('rejects assigning a branch from another tenant', function () {
    $tenant = Tenant::factory()->create();
    $otherTenant = Tenant::factory()->create();
    $staff = User::factory()->create(['tenant_id' => $tenant->id]);
    $foreignBranch = Branch::factory()->for($otherTenant)->create();
    $manager = $this->userWithPermissions($tenant, ['staff.assign-branches']);

    $response = $this->actingAs($manager)->putJson("/api/v1/staff/{$staff->id}/branches", [
        'branch_ids' => [$foreignBranch->id],
    ]);

    $response->assertUnprocessable();
});

it('removes a staff member', function () {
    $tenant = Tenant::factory()->create();
    $staff = User::factory()->create(['tenant_id' => $tenant->id]);
    $manager = $this->userWithPermissions($tenant, ['staff.delete']);

    $this->actingAs($manager)->deleteJson("/api/v1/staff/{$staff->id}")->assertOk();

    expect(User::find($staff->id))->toBeNull();
});

it('serialises a staff member roles as a plain array, not a wrapped collection', function () {
    // Regression: RoleResource::collection(...) nested inside StaffResource's
    // own toArray() serializes as {"data": [...]} once JSON-encoded outside
    // a top-level resource response, but the frontend expects roles to be a
    // plain array and indexes it directly (roles[0], roles.map(...)).
    $tenant = Tenant::factory()->create();
    $roleA = Role::factory()->create(['tenant_id' => $tenant->id]);
    $roleB = Role::factory()->create(['tenant_id' => $tenant->id]);
    $staff = User::factory()->create(['tenant_id' => $tenant->id]);
    $staff->roles()->attach([$roleA->id, $roleB->id]);
    $manager = $this->userWithPermissions($tenant, ['staff.view']);

    $response = $this->actingAs($manager)->getJson("/api/v1/staff/{$staff->id}");

    $response->assertOk();
    expect($response->json('data.roles'))->toBeArray();
    $response->assertJsonCount(2, 'data.roles');
    expect(collect($response->json('data.roles'))->pluck('id'))
        ->toContain($roleA->id, $roleB->id);
});
