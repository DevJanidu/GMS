<?php

use App\Models\Branch;
use App\Models\Plan;
use App\Models\Tenant;
use App\Modules\Membership\Models\Membership;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('lists memberships scoped to the current tenant', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);

    Membership::factory()->for($tenant)->count(2)->create();
    Membership::factory()->count(3)->create(); // other tenants

    $response = $this->actingAs($user)->get(route('memberships.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('memberships/index')
        ->has('memberships.data', 2)
    );
});

it('shows the sell-membership create page', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);

    $response = $this->actingAs($user)->get(route('memberships.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('memberships/create'));
});

it('lists expiring-soon memberships on the renewals page', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();

    Membership::factory()->expiringSoon()->for($tenant)->create(['branch_id' => $branch->id, 'plan_id' => $plan->id]);
    Membership::factory()->for($tenant)->create(['branch_id' => $branch->id, 'plan_id' => $plan->id]); // not expiring

    $response = $this->actingAs($user)->get(route('renewals.expiring'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('renewals/expiring')
        ->has('memberships.data', 1)
    );
});

it('lists expired memberships on the renewals page', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();

    Membership::factory()->expired()->for($tenant)->create(['branch_id' => $branch->id, 'plan_id' => $plan->id]);

    $response = $this->actingAs($user)->get(route('renewals.expired'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('renewals/expired')
        ->has('memberships.data', 1)
    );
});

it('lists in-grace-period memberships on the renewals page', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();

    Membership::factory()->inGracePeriod()->for($tenant)->create(['branch_id' => $branch->id, 'plan_id' => $plan->id]);

    $response = $this->actingAs($user)->get(route('renewals.grace'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('renewals/grace')
        ->has('memberships.data', 1)
    );
});

it('shows renewal dashboard stats', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);

    $response = $this->actingAs($user)->get(route('renewals.dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('renewals/dashboard')
        ->has('stats.expiring_soon')
        ->has('stats.in_grace_period')
        ->has('stats.expired')
        ->has('stats.active')
        ->where('recent_renewals', [])
    );
});

it('queues bulk reminders for selected memberships', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();

    $memberships = Membership::factory()->expiringSoon()->for($tenant)->count(2)->create([
        'branch_id' => $branch->id,
        'plan_id' => $plan->id,
    ]);

    $response = $this->actingAs($user)->post(route('renewals.reminders.store'), [
        'membership_ids' => $memberships->pluck('id')->all(),
    ]);

    $response->assertRedirect();

    foreach ($memberships as $membership) {
        expect($membership->events()->where('type', 'reminder_requested')->count())->toBe(1);
    }
});
