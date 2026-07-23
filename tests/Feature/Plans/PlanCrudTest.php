<?php

use App\Models\Plan;
use App\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('lists plans scoped to the current tenant', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);

    Plan::factory()->for($tenant)->count(2)->create();
    Plan::factory()->count(4)->create(); // other tenants

    $response = $this->actingAs($user)->get(route('plans.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('plans/index')
        ->has('plans.data', 2)
    );
});

it('creates a plan available at all branches by default', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);

    $response = $this->actingAs($user)->post(route('plans.store'), [
        'name' => 'Gold Membership',
        'price' => 49.99,
        'duration_value' => 1,
        'duration_unit' => 'months',
        'available_at_all_branches' => true,
        'status' => 'active',
    ]);

    $plan = Plan::first();

    $response->assertRedirect(route('plans.show', $plan));
    expect($plan->tenant_id)->toBe($tenant->id);
    expect($plan->available_at_all_branches)->toBeTrue();
    expect($plan->branches)->toHaveCount(0);
});

it('updates a plan', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $plan = Plan::factory()->for($tenant)->create(['price' => 30]);

    $response = $this->actingAs($user)->put(route('plans.update', $plan), [
        'name' => $plan->name,
        'price' => 40,
        'duration_value' => $plan->duration_value,
        'duration_unit' => $plan->duration_unit->value,
        'available_at_all_branches' => true,
    ]);

    $response->assertRedirect(route('plans.show', $plan));
    expect((float) $plan->fresh()->price)->toBe(40.0);
});

it('activates and deactivates a plan', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $plan = Plan::factory()->for($tenant)->create();

    $this->actingAs($user)->patch(route('plans.status.update', $plan), ['status' => 'inactive']);
    expect($plan->fresh()->status->value)->toBe('inactive');

    $this->actingAs($user)->patch(route('plans.status.update', $plan), ['status' => 'active']);
    expect($plan->fresh()->status->value)->toBe('active');
});

it('returns a 404 for a plan belonging to another tenant', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $otherPlan = Plan::factory()->create();

    $this->actingAs($user)->get(route('plans.show', $otherPlan))->assertNotFound();
});
