<?php

use App\Models\Branch;
use App\Models\Plan;
use App\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('restricts a plan to the selected branches', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branchA = Branch::factory()->for($tenant)->create();
    $branchB = Branch::factory()->for($tenant)->create();

    $this->actingAs($user)->post(route('plans.store'), [
        'name' => 'Branch-Only Plan',
        'price' => 25,
        'duration_value' => 1,
        'duration_unit' => 'months',
        'available_at_all_branches' => false,
        'branch_ids' => [$branchA->id],
        'status' => 'active',
    ]);

    $plan = Plan::first();

    expect($plan->available_at_all_branches)->toBeFalse();
    expect($plan->isAvailableAtBranch($branchA->id))->toBeTrue();
    expect($plan->isAvailableAtBranch($branchB->id))->toBeFalse();
});

it('clears branch restrictions when a plan is updated back to all branches', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->restrictedToBranches()->create();
    $plan->branches()->attach($branch);

    $this->actingAs($user)->put(route('plans.update', $plan), [
        'name' => $plan->name,
        'price' => $plan->price,
        'duration_value' => $plan->duration_value,
        'duration_unit' => $plan->duration_unit->value,
        'available_at_all_branches' => true,
    ]);

    $plan->refresh();
    expect($plan->available_at_all_branches)->toBeTrue();
    expect($plan->branches)->toHaveCount(0);
});
