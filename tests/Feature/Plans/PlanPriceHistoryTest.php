<?php

use App\Models\Plan;
use App\Models\PlanPriceHistory;
use App\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('records an initial price history entry when a plan is created', function () {
    $tenant = Tenant::factory()->create();
    $plan = Plan::factory()->for($tenant)->create(['price' => 50]);

    expect($plan->priceHistory()->count())->toBe(1);
    expect((float) $plan->priceHistory()->first()->price)->toBe(50.0);
    expect($plan->priceHistory()->first()->effective_until)->toBeNull();
});

it('closes the previous price period and opens a new one when the price changes', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $plan = Plan::factory()->for($tenant)->create(['price' => 50]);

    $this->actingAs($user)->put(route('plans.update', $plan), [
        'name' => $plan->name,
        'price' => 75,
        'duration_value' => $plan->duration_value,
        'duration_unit' => $plan->duration_unit->value,
        'available_at_all_branches' => true,
    ]);

    expect(PlanPriceHistory::query()->where('plan_id', $plan->id)->count())->toBe(2);

    $closed = PlanPriceHistory::query()->where('plan_id', $plan->id)->whereNotNull('effective_until')->first();
    $open = PlanPriceHistory::query()->where('plan_id', $plan->id)->whereNull('effective_until')->first();

    expect((float) $closed->price)->toBe(50.0);
    expect((float) $open->price)->toBe(75.0);
});

it('does not create a history entry when unrelated fields change', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $plan = Plan::factory()->for($tenant)->create(['price' => 50, 'name' => 'Original']);

    $this->actingAs($user)->put(route('plans.update', $plan), [
        'name' => 'Renamed',
        'price' => 50,
        'duration_value' => $plan->duration_value,
        'duration_unit' => $plan->duration_unit->value,
        'available_at_all_branches' => true,
    ]);

    expect(PlanPriceHistory::query()->where('plan_id', $plan->id)->count())->toBe(1);
});
