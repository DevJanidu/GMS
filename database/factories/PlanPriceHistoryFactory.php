<?php

namespace Database\Factories;

use App\Models\Plan;
use App\Models\PlanPriceHistory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PlanPriceHistory>
 */
class PlanPriceHistoryFactory extends Factory
{
    protected $model = PlanPriceHistory::class;

    public function definition(): array
    {
        return [
            'plan_id' => Plan::factory(),
            'price' => fake()->randomFloat(2, 20, 200),
            'joining_fee' => 0,
            'effective_from' => now(),
            'effective_until' => null,
        ];
    }
}
