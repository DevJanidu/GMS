<?php

namespace Database\Factories;

use App\Models\Branch;
use App\Models\Member;
use App\Models\Plan;
use App\Models\Tenant;
use App\Modules\Membership\Enums\MembershipStatus;
use App\Modules\Membership\Models\Membership;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Membership>
 */
class MembershipFactory extends Factory
{
    protected $model = Membership::class;

    public function definition(): array
    {
        $startsOn = now()->toImmutable()->startOfDay();
        $expiresOn = $startsOn->addMonth();
        $graceDays = 7;

        return [
            'tenant_id' => Tenant::factory(),
            'branch_id' => fn (array $attributes) => Branch::factory()->create([
                'tenant_id' => $attributes['tenant_id'],
            ])->id,
            'member_id' => fn (array $attributes) => Member::factory()->create([
                'tenant_id' => $attributes['tenant_id'],
                'branch_id' => $attributes['branch_id'],
            ])->id,
            'plan_id' => fn (array $attributes) => Plan::factory()->create([
                'tenant_id' => $attributes['tenant_id'],
            ])->id,
            'plan_name_snapshot' => 'Gold Membership',
            'plan_price_snapshot' => 49.99,
            'plan_joining_fee_snapshot' => 0,
            'plan_duration_value_snapshot' => 1,
            'plan_duration_unit_snapshot' => 'months',
            'plan_access_rules_snapshot' => [],
            'starts_on' => $startsOn->toDateString(),
            'expires_on' => $expiresOn->toDateString(),
            'grace_days' => $graceDays,
            'grace_ends_on' => $expiresOn->addDays($graceDays)->toDateString(),
            'status' => MembershipStatus::Active,
            'sold_at' => now(),
        ];
    }

    public function pending(): static
    {
        $startsOn = now()->toImmutable()->addWeek()->startOfDay();

        return $this->state(fn (array $attributes) => [
            'status' => MembershipStatus::Pending,
            'starts_on' => $startsOn->toDateString(),
            'expires_on' => $startsOn->addMonth()->toDateString(),
            'grace_ends_on' => $startsOn->addMonth()->addDays($attributes['grace_days'] ?? 7)->toDateString(),
        ]);
    }

    public function expiringSoon(): static
    {
        $expiresOn = now()->toImmutable()->addDays(3)->startOfDay();

        return $this->state(fn (array $attributes) => [
            'status' => MembershipStatus::Active,
            'starts_on' => $expiresOn->subMonth()->toDateString(),
            'expires_on' => $expiresOn->toDateString(),
            'grace_ends_on' => $expiresOn->addDays($attributes['grace_days'] ?? 7)->toDateString(),
        ]);
    }

    public function inGracePeriod(): static
    {
        $expiresOn = now()->toImmutable()->subDays(2)->startOfDay();

        return $this->state(fn (array $attributes) => [
            'status' => MembershipStatus::Active,
            'starts_on' => $expiresOn->subMonth()->toDateString(),
            'expires_on' => $expiresOn->toDateString(),
            'grace_ends_on' => $expiresOn->addDays($attributes['grace_days'] ?? 7)->toDateString(),
        ]);
    }

    public function expired(): static
    {
        $expiresOn = now()->toImmutable()->subDays(30)->startOfDay();

        return $this->state(fn (array $attributes) => [
            'status' => MembershipStatus::Expired,
            'starts_on' => $expiresOn->subMonth()->toDateString(),
            'expires_on' => $expiresOn->toDateString(),
            'grace_ends_on' => $expiresOn->addDays($attributes['grace_days'] ?? 7)->toDateString(),
            'expired_at' => $expiresOn->addDays(($attributes['grace_days'] ?? 7) + 1),
        ]);
    }

    public function frozen(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => MembershipStatus::Frozen,
            'freeze_started_on' => now()->toImmutable()->subDays(2)->toDateString(),
        ]);
    }

    public function suspended(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => MembershipStatus::Suspended,
            'suspended_at' => now(),
            'suspension_reason' => 'Payment dispute',
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => MembershipStatus::Cancelled,
            'cancelled_at' => now(),
            'cancellation_reason' => 'Member requested cancellation',
        ]);
    }
}
