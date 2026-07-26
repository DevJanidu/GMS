<?php

use App\Models\Branch;
use App\Models\Plan;
use App\Models\Tenant;
use App\Modules\Membership\Enums\MembershipStatus;
use App\Modules\Membership\Models\Membership;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('freezes an active membership', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();
    $membership = Membership::factory()->for($tenant)->create(['branch_id' => $branch->id, 'plan_id' => $plan->id]);

    $response = $this->actingAs($user)->patch(route('memberships.freeze', $membership), [
        'reason' => 'Traveling abroad',
    ]);

    $response->assertRedirect();
    expect($membership->fresh()->status)->toBe(MembershipStatus::Frozen);
    expect($membership->fresh()->freeze_started_on->toDateString())->toBe(now()->toDateString());
});

it('resuming a freeze extends expiry by the paused days', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();
    $membership = Membership::factory()->for($tenant)->create([
        'branch_id' => $branch->id,
        'plan_id' => $plan->id,
        'status' => MembershipStatus::Frozen,
        'expires_on' => now()->addDays(10),
        'grace_ends_on' => now()->addDays(17),
        'freeze_started_on' => now()->subDays(4),
    ]);

    $originalExpiry = $membership->expires_on;

    $this->actingAs($user)->patch(route('memberships.resume', $membership));

    $fresh = $membership->fresh();
    expect($fresh->status)->toBe(MembershipStatus::Active);
    expect($fresh->expires_on->toDateString())->toBe($originalExpiry->addDays(4)->toDateString());
    expect($fresh->frozen_days_used)->toBe(4);
    expect($fresh->freeze_started_on)->toBeNull();
});

it('cannot freeze a membership that is not active', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();
    $membership = Membership::factory()->cancelled()->for($tenant)->create(['branch_id' => $branch->id, 'plan_id' => $plan->id]);

    $response = $this->actingAs($user)->patch(route('memberships.freeze', $membership), [
        'reason' => 'Traveling',
    ]);

    $response->assertSessionHasErrors('membership');
});

it('suspends an active membership without extending its expiry', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();
    $membership = Membership::factory()->for($tenant)->create(['branch_id' => $branch->id, 'plan_id' => $plan->id]);
    $originalExpiry = $membership->expires_on;

    $response = $this->actingAs($user)->patch(route('memberships.suspend', $membership), [
        'reason' => 'Payment dispute',
    ]);

    $response->assertRedirect();
    $fresh = $membership->fresh();
    expect($fresh->status)->toBe(MembershipStatus::Suspended);
    expect($fresh->suspension_reason)->toBe('Payment dispute');
    expect($fresh->expires_on->toDateString())->toBe($originalExpiry->toDateString());
});

it('requires a reason to suspend', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();
    $membership = Membership::factory()->for($tenant)->create(['branch_id' => $branch->id, 'plan_id' => $plan->id]);

    $response = $this->actingAs($user)->patch(route('memberships.suspend', $membership), []);

    $response->assertSessionHasErrors('reason');
});
