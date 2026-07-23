<?php

namespace Database\Factories;

use App\Enums\MemberStatus;
use App\Models\Member;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Member>
 */
class MemberFactory extends Factory
{
    protected $model = Member::class;

    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory(),
            'branch_id' => null,
            'member_number' => 'MEM-'.fake()->unique()->numberBetween(10000, 99999),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'gender' => fake()->randomElement(['male', 'female', 'other']),
            'date_of_birth' => fake()->date('Y-m-d', '-18 years'),
            'address' => fake()->address(),
            'status' => MemberStatus::Active,
            'joined_at' => now()->toDateString(),
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => MemberStatus::Inactive,
        ]);
    }

    public function archived(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => MemberStatus::Archived,
            'archived_at' => now(),
        ]);
    }
}
