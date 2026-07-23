<?php

use App\Models\Branch;
use App\Models\Plan;
use App\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('clones a plan as an inactive draft carrying its branch availability', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->restrictedToBranches()->create(['name' => 'Original Plan']);
    $plan->branches()->attach($branch);

    $response = $this->actingAs($user)->post(route('plans.clone', $plan));

    $clone = Plan::query()->where('cloned_from_id', $plan->id)->firstOrFail();

    $response->assertRedirect(route('plans.edit', $clone));
    expect($clone->name)->toBe('Original Plan (Copy)');
    expect($clone->status->value)->toBe('inactive');
    expect($clone->slug)->not->toBe($plan->slug);
    expect($clone->branches->pluck('id'))->toContain($branch->id);
});
