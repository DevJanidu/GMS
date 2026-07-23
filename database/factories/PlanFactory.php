<?php

namespace Database\Factories;

use App\Enums\DurationUnit;
use App\Enums\PlanStatus;
use App\Models\Plan;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Plan>
 */
class PlanFactory extends Factory
{
    protected $model = Plan::class;

    public function definition(): array
    {
        $name = ucfirst(fake()->unique()->word()).' Membership';

        return [
            'tenant_id' => Tenant::factory(),
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(1000, 9999),
            'description' => fake()->sentence(),
            'price' => fake()->randomFloat(2, 20, 200),
            'joining_fee' => 0,
            'duration_value' => 1,
            'duration_unit' => DurationUnit::Months,
            'access_rules' => [],
            'available_at_all_branches' => true,
            'status' => PlanStatus::Active,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PlanStatus::Inactive,
        ]);
    }

    public function restrictedToBranches(): static
    {
        return $this->state(fn (array $attributes) => [
            'available_at_all_branches' => false,
        ]);
    }
}
