<?php

namespace App\Modules\Billing\Database\Factories;

use App\Modules\Billing\Models\Payment;
use App\Modules\Billing\Models\Refund;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Refund> */
class RefundFactory extends Factory
{
    protected $model = Refund::class;

    public function definition(): array
    {
        return [
            'payment_id' => Payment::factory(),
            'invoice_id' => fn (array $attributes) => Payment::withoutGlobalScopes()->whereKey($attributes['payment_id'])->firstOrFail()->invoice_id,
            'tenant_id' => fn (array $attributes) => Payment::withoutGlobalScopes()->whereKey($attributes['payment_id'])->firstOrFail()->tenant_id,
            'branch_id' => fn (array $attributes) => Payment::withoutGlobalScopes()->whereKey($attributes['payment_id'])->firstOrFail()->branch_id,
            'refund_number' => 'REF-'.fake()->unique()->numerify('######'),
            'amount_cents' => 500,
            'reason' => fake()->sentence(),
            'idempotency_key' => fake()->uuid(),
            'refunded_at' => now(),
        ];
    }
}
