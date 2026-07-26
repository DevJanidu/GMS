<?php

use App\Models\Branch;
use App\Models\Plan;
use App\Models\Tenant;
use App\Modules\Membership\Enums\MembershipStatus;
use App\Modules\Membership\Models\Membership;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('serialises plan price and joining fee as numbers on the renew-membership page', function () {
    // Regression: Plan casts price/joining_fee as `decimal:2`, which Eloquent
    // serializes as strings. The React page calls .toFixed()/arithmetic on
    // these values and crashes the whole component if they arrive as
    // strings instead of numbers.
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create(['price' => 49.99, 'joining_fee' => 10.5]);

    $membership = Membership::factory()->for($tenant)->create([
        'branch_id' => $branch->id,
        'plan_id' => $plan->id,
        'status' => MembershipStatus::Active,
    ]);

    $response = $this->actingAs($user)->get(route('memberships.renew.create', $membership));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('memberships/renew')
        ->where('plans.0.price', 49.99)
        ->where('plans.0.joining_fee', 10.5)
    );
});

it('renews early without losing already-paid days', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();

    $current = Membership::factory()
        ->for($tenant)
        ->create([
            'branch_id' => $branch->id,
            'plan_id' => $plan->id,
            'status' => MembershipStatus::Active,
            'starts_on' => now()->subDays(10),
            'expires_on' => now()->addDays(20), // still 20 days of paid time left
            'grace_days' => 7,
            'grace_ends_on' => now()->addDays(27),
        ]);

    $response = $this->actingAs($user)->post(route('memberships.renew.store', $current), [
        'plan_id' => $plan->id,
    ]);

    $renewed = Membership::where('previous_membership_id', $current->id)->first();

    $response->assertRedirect(route('memberships.show', $renewed));

    // The new membership must start the day after the current one's expiry,
    // not today — otherwise the member loses the 20 remaining paid days.
    expect($renewed->starts_on->toDateString())->toBe(now()->addDays(21)->toDateString());
    expect($renewed->status)->toBe(MembershipStatus::Pending);
    expect($current->fresh()->hasForwardRenewal())->toBeTrue();
});

it('renews a lapsed membership starting today', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();

    $current = Membership::factory()->expired()->for($tenant)->create([
        'branch_id' => $branch->id,
        'plan_id' => $plan->id,
    ]);

    $this->actingAs($user)->post(route('memberships.renew.store', $current), [
        'plan_id' => $plan->id,
    ]);

    $renewed = Membership::where('previous_membership_id', $current->id)->first();

    expect($renewed->starts_on->toDateString())->toBe(now()->toDateString());
    expect($renewed->status)->toBe(MembershipStatus::Active);
});

it('prevents renewing an already-renewed membership', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();

    $current = Membership::factory()->for($tenant)->create(['branch_id' => $branch->id, 'plan_id' => $plan->id]);
    Membership::factory()->for($tenant)->create([
        'branch_id' => $branch->id,
        'plan_id' => $plan->id,
        'previous_membership_id' => $current->id,
    ]);

    $response = $this->actingAs($user)->post(route('memberships.renew.store', $current), [
        'plan_id' => $plan->id,
    ]);

    $response->assertSessionHasErrors('membership');
});

it('prevents renewing a cancelled membership', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();

    $current = Membership::factory()->cancelled()->for($tenant)->create(['branch_id' => $branch->id, 'plan_id' => $plan->id]);

    $response = $this->actingAs($user)->post(route('memberships.renew.store', $current), [
        'plan_id' => $plan->id,
    ]);

    $response->assertSessionHasErrors('membership');
});
