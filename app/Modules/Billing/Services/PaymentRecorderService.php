<?php

namespace App\Modules\Billing\Services;

use App\Modules\Billing\Enums\PaymentMethod;
use App\Modules\Billing\Models\Invoice;
use App\Modules\Billing\Models\Payment;
use DomainException;
use Illuminate\Support\Facades\DB;

/**
 * Internal implementation ready to adapt to the future shared PaymentRecorder.
 */
class PaymentRecorderService
{
    public function __construct(
        private readonly BillingSequence $sequence,
        private readonly InvoiceReconciler $reconciler,
        private readonly ReceiptGeneratorService $receipts,
        private readonly BillingEventStore $events,
    ) {}

    /**
     * @param array{
     *   amount_cents:int, method:string, reference?:string|null, idempotency_key:string,
     *   metadata?:array<string,mixed>|null, paid_at?:string|null, recorded_by?:int|null
     * } $data
     */
    public function record(Invoice $invoice, array $data): Payment
    {
        return DB::transaction(function () use ($invoice, $data): Payment {
            $locked = Invoice::query()->lockForUpdate()->findOrFail($invoice->id);
            $existing = Payment::query()->where('idempotency_key', $data['idempotency_key'])->first();
            if ($existing) {
                if (
                    $existing->invoice_id !== $locked->id
                    || $existing->amount_cents !== $data['amount_cents']
                    || $existing->method !== PaymentMethod::from($data['method'])
                    || $existing->reference !== ($data['reference'] ?? null)
                ) {
                    throw new DomainException('The idempotency key was already used for a different payment.');
                }

                return $existing->load('receipt');
            }

            if ($locked->isVoid()) {
                throw new DomainException('A void invoice cannot receive payments.');
            }
            if ($data['amount_cents'] < 1 || $data['amount_cents'] > $locked->balance_due_cents) {
                throw new DomainException('Payment must be positive and cannot exceed the outstanding balance.');
            }

            $payment = Payment::query()->create([
                'tenant_id' => $locked->tenant_id,
                'branch_id' => $locked->branch_id,
                'invoice_id' => $locked->id,
                'payment_number' => $this->sequence->next('payment', 'PAY'),
                'amount_cents' => $data['amount_cents'],
                'method' => PaymentMethod::from($data['method']),
                'reference' => $data['reference'] ?? null,
                'idempotency_key' => $data['idempotency_key'],
                'metadata' => $data['metadata'] ?? null,
                'paid_at' => $data['paid_at'] ?? now(),
                'recorded_by' => $data['recorded_by'] ?? null,
            ]);

            $this->reconciler->reconcile($locked);
            $receipt = $this->receipts->generate($payment, $data['recorded_by'] ?? null);
            $this->events->record('PaymentCompleted', $payment, [
                'invoice_id' => $locked->id,
                'amount_cents' => $payment->amount_cents,
                'method' => $payment->method->value,
                'receipt_id' => $receipt->id,
            ]);

            return $payment->load('receipt');
        });
    }
}
