<?php

namespace App\Modules\Billing\Database\Factories;

use App\Models\Branch;
use App\Models\Tenant;
use App\Modules\Billing\Enums\InvoiceStatus;
use App\Modules\Billing\Models\Invoice;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Invoice> */
class InvoiceFactory extends Factory
{
    protected $model = Invoice::class;

    public function definition(): array
    {
        $total = fake()->numberBetween(5000, 100000);

        return [
            'tenant_id' => Tenant::factory(),
            'branch_id' => fn (array $attributes) => Branch::factory()->create([
                'tenant_id' => $attributes['tenant_id'],
            ])->id,
            'invoice_number' => 'INV-'.fake()->unique()->numerify('######'),
            'status' => InvoiceStatus::Open,
            'currency' => 'LKR',
            'issued_on' => now()->toDateString(),
            'subtotal_cents' => $total,
            'discount_value' => 0,
            'discount_cents' => 0,
            'tax_rate_basis_points' => 0,
            'tax_cents' => 0,
            'joining_fee_cents' => 0,
            'grand_total_cents' => $total,
            'amount_paid_cents' => 0,
            'amount_refunded_cents' => 0,
            'balance_due_cents' => $total,
        ];
    }
}
