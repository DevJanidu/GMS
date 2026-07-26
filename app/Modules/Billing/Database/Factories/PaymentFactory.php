<?php

namespace App\Modules\Billing\Database\Factories;

use App\Modules\Billing\Enums\PaymentMethod;
use App\Modules\Billing\Models\Invoice;
use App\Modules\Billing\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Payment> */
class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        return [
            'invoice_id' => Invoice::factory(),
            'tenant_id' => fn (array $attributes) => Invoice::withoutGlobalScopes()->whereKey($attributes['invoice_id'])->firstOrFail()->tenant_id,
            'branch_id' => fn (array $attributes) => Invoice::withoutGlobalScopes()->whereKey($attributes['invoice_id'])->firstOrFail()->branch_id,
            'payment_number' => 'PAY-'.fake()->unique()->numerify('######'),
            'amount_cents' => 1000,
            'method' => PaymentMethod::Cash,
            'idempotency_key' => fake()->uuid(),
            'paid_at' => now(),
        ];
    }
}
