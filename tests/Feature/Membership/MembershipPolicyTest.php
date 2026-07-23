<?php

use App\Models\Branch;
use App\Models\Plan;
use App\Models\Tenant;
use App\Models\User;
use App\Modules\Membership\Models\Membership;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\InteractsWithPermissions;

uses(RefreshDatabase::class, InteractsWithPermissions::class);

it('denies access to a user without memberships.view', function () {
    $tenant = Tenant::factory()->create();
    $user = User::factory()->create(['tenant_id' => $tenant->id]);

    $this->actingAs($user)->get(route('memberships.index'))->assertForbidden();
});

it('allows a user with memberships.view to list but blocks selling', function () {
    $tenant = Tenant::factory()->create();
    $user = $this->userWithPermissions($tenant, ['memberships.view']);

    $this->actingAs($user)->get(route('memberships.index'))->assertOk();
    $this->actingAs($user)->get(route('memberships.create'))->assertForbidden();
});

it('allows a user with memberships.freeze to freeze but blocks cancel', function () {
    $tenant = Tenant::factory()->create();
    $user = $this->userWithPermissions($tenant, ['memberships.freeze']);
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();
    $membership = Membership::factory()->for($tenant)->create(['branch_id' => $branch->id, 'plan_id' => $plan->id]);

    $this->actingAs($user)->patch(route('memberships.freeze', $membership), ['reason' => 'x'])->assertRedirect();
    $this->actingAs($user)->patch(route('memberships.cancel', $membership), ['reason' => 'x'])->assertForbidden();
});
