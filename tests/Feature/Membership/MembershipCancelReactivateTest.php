<?php

use App\Models\Branch;
use App\Models\Plan;
use App\Models\Tenant;
use App\Modules\Membership\Enums\MembershipStatus;
use App\Modules\Membership\Models\Membership;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('cancels a membership', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();
    $membership = Membership::factory()->for($tenant)->create(['branch_id' => $branch->id, 'plan_id' => $plan->id]);

    $response = $this->actingAs($user)->patch(route('memberships.cancel', $membership), [
        'reason' => 'Member requested cancellation',
    ]);

    $response->assertRedirect();
    $fresh = $membership->fresh();
    expect($fresh->status)->toBe(MembershipStatus::Cancelled);
    expect($fresh->cancelled_at)->not->toBeNull();
});

it('cannot cancel an already-cancelled membership', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();
    $membership = Membership::factory()->cancelled()->for($tenant)->create(['branch_id' => $branch->id, 'plan_id' => $plan->id]);

    $response = $this->actingAs($user)->patch(route('memberships.cancel', $membership), [
        'reason' => 'Again',
    ]);

    $response->assertSessionHasErrors('membership');
});

it('reactivates a frozen membership crediting the frozen days back', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();
    $membership = Membership::factory()->for($tenant)->create([
        'branch_id' => $branch->id,
        'plan_id' => $plan->id,
        'status' => MembershipStatus::Frozen,
        'expires_on' => now()->addDays(5),
        'grace_ends_on' => now()->addDays(12),
        'freeze_started_on' => now()->subDays(3),
    ]);

    $this->actingAs($user)->patch(route('memberships.reactivate', $membership));

    $fresh = $membership->fresh();
    expect($fresh->status)->toBe(MembershipStatus::Active);
    expect($fresh->expires_on->toDateString())->toBe(now()->addDays(8)->toDateString());
});

it('reactivates a suspended membership without changing dates', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();
    $membership = Membership::factory()->suspended()->for($tenant)->create([
        'branch_id' => $branch->id,
        'plan_id' => $plan->id,
        'expires_on' => now()->addDays(5),
        'grace_ends_on' => now()->addDays(12),
    ]);

    $this->actingAs($user)->patch(route('memberships.reactivate', $membership));

    $fresh = $membership->fresh();
    expect($fresh->status)->toBe(MembershipStatus::Active);
    expect($fresh->suspension_reason)->toBeNull();
    expect($fresh->expires_on->toDateString())->toBe(now()->addDays(5)->toDateString());
});

it('cannot reactivate a cancelled membership', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();
    $membership = Membership::factory()->cancelled()->for($tenant)->create(['branch_id' => $branch->id, 'plan_id' => $plan->id]);

    $response = $this->actingAs($user)->patch(route('memberships.reactivate', $membership));

    $response->assertSessionHasErrors('membership');
});

it('cannot reactivate an expired membership', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();
    $membership = Membership::factory()->expired()->for($tenant)->create(['branch_id' => $branch->id, 'plan_id' => $plan->id]);

    $response = $this->actingAs($user)->patch(route('memberships.reactivate', $membership));

    $response->assertSessionHasErrors('membership');
});
