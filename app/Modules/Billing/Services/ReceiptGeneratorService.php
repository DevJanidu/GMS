<?php

namespace App\Modules\Billing\Services;

use App\Modules\Billing\Models\Payment;
use App\Modules\Billing\Models\Receipt;

/**
 * Internal implementation ready to adapt to the future shared ReceiptGenerator.
 */
class ReceiptGeneratorService
{
    public function __construct(private readonly BillingSequence $sequence) {}

    public function generate(Payment $payment, ?int $userId = null): Receipt
    {
        if ($payment->receipt) {
            return $payment->receipt;
        }

        $invoice = $payment->invoice()->with(['items', 'member', 'branch'])->firstOrFail();

        return Receipt::query()->create([
            'tenant_id' => $payment->tenant_id,
            'branch_id' => $payment->branch_id,
            'invoice_id' => $payment->invoice_id,
            'payment_id' => $payment->id,
            'receipt_number' => $this->sequence->next('receipt', 'RCT'),
            'snapshot' => [
                'invoice_number' => $invoice->invoice_number,
                'payment_number' => $payment->payment_number,
                'member' => $invoice->member?->fullName(),
                'branch' => $invoice->branch->name,
                'currency' => $invoice->currency,
                'amount_cents' => $payment->amount_cents,
                'method' => $payment->method->value,
                'reference' => $payment->reference,
                'paid_at' => $payment->paid_at->toIso8601String(),
                'invoice_total_cents' => $invoice->grand_total_cents,
                'balance_due_cents' => $invoice->balance_due_cents,
                'items' => $invoice->items->map->only([
                    'description', 'quantity', 'unit_price_cents', 'line_total_cents',
                ])->values()->all(),
            ],
            'generated_at' => now(),
            'generated_by' => $userId,
        ]);
    }
}
