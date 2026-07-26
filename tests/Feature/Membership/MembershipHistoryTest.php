<?php

use App\Models\Branch;
use App\Models\Plan;
use App\Models\Tenant;
use App\Modules\Membership\Models\Membership;
use App\Modules\Membership\Models\MembershipEvent;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('records a full, ordered event history across the membership lifecycle', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();

    $membership = Membership::factory()->for($tenant)->create(['branch_id' => $branch->id, 'plan_id' => $plan->id]);

    $this->actingAs($user)->patch(route('memberships.freeze', $membership), ['reason' => 'trip']);
    $this->actingAs($user)->patch(route('memberships.resume', $membership));
    $this->actingAs($user)->patch(route('memberships.suspend', $membership), ['reason' => 'nonpayment']);
    $this->actingAs($user)->patch(route('memberships.reactivate', $membership));
    $this->actingAs($user)->patch(route('memberships.cancel', $membership), ['reason' => 'done']);

    $types = $membership->events()->pluck('type')->map(fn ($type) => $type->value)->all();

    expect($types)->toBe(['cancelled', 'reactivated', 'suspended', 'resumed', 'frozen']);
});

it('refuses to delete a membership', function () {
    $membership = Membership::factory()->create();

    expect(fn () => $membership->delete())->toThrow(RuntimeException::class);
});

it('refuses to delete or update a membership event', function () {
    $event = MembershipEvent::factory()->create();

    expect(fn () => $event->delete())->toThrow(RuntimeException::class);
    expect(fn () => $event->update(['to_status' => 'active']))->toThrow(RuntimeException::class);
});
