<?php

use App\Models\Branch;
use App\Models\Plan;
use App\Models\Tenant;
use App\Modules\Membership\Enums\MembershipStatus;
use App\Modules\Membership\Events\MembershipExpired;
use App\Modules\Membership\Events\MembershipExpiring;
use App\Modules\Membership\Models\Membership;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;

uses(RefreshDatabase::class);

it('flags an active membership expiring within the configured window', function () {
    Event::fake([MembershipExpiring::class]);

    $tenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();
    $membership = Membership::factory()->expiringSoon()->for($tenant)->create(['branch_id' => $branch->id, 'plan_id' => $plan->id]);

    $this->artisan('membership:process-expiry')->assertExitCode(0);

    $fresh = $membership->fresh();
    expect($fresh->expiring_notified_at)->not->toBeNull();
    expect($fresh->status)->toBe(MembershipStatus::Active);
    Event::assertDispatched(MembershipExpiring::class);
});

it('does not re-flag a membership already marked as expiring soon', function () {
    Event::fake([MembershipExpiring::class]);

    $tenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();
    Membership::factory()->expiringSoon()->for($tenant)->create([
        'branch_id' => $branch->id,
        'plan_id' => $plan->id,
        'expiring_notified_at' => now()->subDay(),
    ]);

    $this->artisan('membership:process-expiry');

    Event::assertNotDispatched(MembershipExpiring::class);
});

it('does not flag a membership that already has a linked renewal', function () {
    Event::fake([MembershipExpiring::class]);

    $tenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();
    $current = Membership::factory()->expiringSoon()->for($tenant)->create(['branch_id' => $branch->id, 'plan_id' => $plan->id]);
    Membership::factory()->pending()->for($tenant)->create([
        'branch_id' => $branch->id,
        'plan_id' => $plan->id,
        'previous_membership_id' => $current->id,
    ]);

    $this->artisan('membership:process-expiry');

    Event::assertNotDispatched(MembershipExpiring::class);
});

it('expires a membership once its grace period has fully elapsed', function () {
    Event::fake([MembershipExpired::class]);

    $tenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();
    $membership = Membership::factory()->for($tenant)->create([
        'branch_id' => $branch->id,
        'plan_id' => $plan->id,
        'status' => MembershipStatus::Active,
        'expires_on' => now()->subDays(10),
        'grace_days' => 7,
        'grace_ends_on' => now()->subDays(3),
    ]);

    $this->artisan('membership:process-expiry');

    $fresh = $membership->fresh();
    expect($fresh->status)->toBe(MembershipStatus::Expired);
    expect($fresh->expired_at)->not->toBeNull();
    Event::assertDispatched(MembershipExpired::class);
});

it('keeps a membership active while still inside its grace period', function () {
    $tenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();
    $membership = Membership::factory()->inGracePeriod()->for($tenant)->create(['branch_id' => $branch->id, 'plan_id' => $plan->id]);

    $this->artisan('membership:process-expiry');

    $fresh = $membership->fresh();
    expect($fresh->status)->toBe(MembershipStatus::Active);
    expect($fresh->isInGracePeriod())->toBeTrue();
});

it('does not expire a frozen membership even if its expiry date has passed', function () {
    $tenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();
    $membership = Membership::factory()->for($tenant)->create([
        'branch_id' => $branch->id,
        'plan_id' => $plan->id,
        'status' => MembershipStatus::Frozen,
        'expires_on' => now()->subDays(10),
        'grace_ends_on' => now()->subDays(3),
        'freeze_started_on' => now()->subDays(5),
    ]);

    $this->artisan('membership:process-expiry');

    expect($membership->fresh()->status)->toBe(MembershipStatus::Frozen);
});
