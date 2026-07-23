<?php

use App\Enums\DurationUnit;
use App\Models\Branch;
use App\Models\Member;
use App\Models\Plan;
use App\Models\Tenant;
use App\Models\User;
use App\Modules\Billing\Models\Invoice;
use App\Modules\Billing\Models\Payment;
use App\Modules\Billing\Models\Receipt;
use App\Modules\Membership\Enums\MembershipStatus;
use App\Modules\Membership\Models\Membership;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('sells a membership to an existing member with an immediate start date', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $member = Member::factory()->for($tenant)->create(['branch_id' => $branch->id]);
    $plan = Plan::factory()->for($tenant)->create([
        'name' => 'Gold Plan',
        'price' => 60,
        'joining_fee' => 10,
        'duration_value' => 1,
        'duration_unit' => DurationUnit::Months,
        'access_rules' => ['grace_days_allowed' => 5],
    ]);

    $response = $this->actingAs($user)->post(route('memberships.store'), [
        'member_id' => $member->id,
        'plan_id' => $plan->id,
        'branch_id' => $branch->id,
        'initial_payment' => 70,
        'payment_method' => 'cash',
    ]);

    $membership = Membership::first();

    $response->assertRedirect(route('memberships.show', $membership));

    expect($membership->status)->toBe(MembershipStatus::Active);
    expect($membership->tenant_id)->toBe($tenant->id);
    expect($membership->member_id)->toBe($member->id);
    expect((float) $membership->plan_price_snapshot)->toBe(60.0);
    expect((float) $membership->plan_joining_fee_snapshot)->toBe(10.0);
    expect($membership->plan_name_snapshot)->toBe('Gold Plan');
    expect($membership->grace_days)->toBe(5);
    expect($membership->starts_on->toDateString())->toBe(now()->toDateString());
    expect($membership->expires_on->toDateString())->toBe(now()->addMonth()->toDateString());
    expect($membership->grace_ends_on->toDateString())->toBe(now()->addMonth()->addDays(5)->toDateString());
    expect($membership->invoice_id)->not->toBeNull();
    expect($membership->events()->count())->toBe(2); // created + activated

    $invoice = Invoice::query()->findOrFail($membership->invoice_id);
    expect($invoice->membership_id)->toBe($membership->id)
        ->and($invoice->grand_total_cents)->toBe(7000)
        ->and($invoice->amount_paid_cents)->toBe(7000)
        ->and($invoice->balance_due_cents)->toBe(0)
        ->and(Payment::query()->where('invoice_id', $invoice->id)->value('amount_cents'))->toBe(7000)
        ->and(Receipt::query()->where('invoice_id', $invoice->id)->exists())->toBeTrue();
});

it('sells a membership with a future start date as pending', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $member = Member::factory()->for($tenant)->create(['branch_id' => $branch->id]);
    $plan = Plan::factory()->for($tenant)->create();

    $futureDate = now()->addWeek()->toDateString();

    $this->actingAs($user)->post(route('memberships.store'), [
        'member_id' => $member->id,
        'plan_id' => $plan->id,
        'branch_id' => $branch->id,
        'starts_on' => $futureDate,
    ]);

    $membership = Membership::first();

    expect($membership->status)->toBe(MembershipStatus::Pending);
    expect($membership->starts_on->toDateString())->toBe($futureDate);
    expect($membership->events()->count())->toBe(1); // created only, not activated yet
});

it('rejects selling an inactive plan', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $member = Member::factory()->for($tenant)->create(['branch_id' => $branch->id]);
    $plan = Plan::factory()->inactive()->for($tenant)->create();

    $response = $this->actingAs($user)->post(route('memberships.store'), [
        'member_id' => $member->id,
        'plan_id' => $plan->id,
        'branch_id' => $branch->id,
    ]);

    $response->assertSessionHasErrors('plan_id');
    expect(Membership::count())->toBe(0);
});

it('rejects selling a plan not available at the selected branch', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $otherBranch = Branch::factory()->for($tenant)->create();
    $member = Member::factory()->for($tenant)->create(['branch_id' => $branch->id]);
    $plan = Plan::factory()->restrictedToBranches()->for($tenant)->create();
    $plan->branches()->sync([$otherBranch->id]);

    $response = $this->actingAs($user)->post(route('memberships.store'), [
        'member_id' => $member->id,
        'plan_id' => $plan->id,
        'branch_id' => $branch->id,
    ]);

    $response->assertSessionHasErrors('plan_id');
    expect(Membership::count())->toBe(0);
});

it('rejects a member from another tenant', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $branch = Branch::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();
    $otherMember = Member::factory()->create();

    $response = $this->actingAs($user)->post(route('memberships.store'), [
        'member_id' => $otherMember->id,
        'plan_id' => $plan->id,
        'branch_id' => $branch->id,
    ]);

    $response->assertSessionHasErrors('member_id');
});

it('returns a 404 for a membership belonging to another tenant', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $otherMembership = Membership::factory()->create();

    $this->actingAs($user)->get(route('memberships.show', $otherMembership))->assertNotFound();
});

it('requires permission to sell a membership', function () {
    $tenant = Tenant::factory()->create();
    $user = User::factory()->create(['tenant_id' => $tenant->id]);
    $branch = Branch::factory()->for($tenant)->create();
    $member = Member::factory()->for($tenant)->create();
    $plan = Plan::factory()->for($tenant)->create();

    $response = $this->actingAs($user)->post(route('memberships.store'), [
        'member_id' => $member->id,
        'plan_id' => $plan->id,
        'branch_id' => $branch->id,
    ]);

    $response->assertForbidden();
});
