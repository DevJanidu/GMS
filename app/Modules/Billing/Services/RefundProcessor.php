<?php

namespace App\Modules\Billing\Services;

use App\Modules\Billing\Models\Invoice;
use App\Modules\Billing\Models\Payment;
use App\Modules\Billing\Models\Refund;
use DomainException;
use Illuminate\Support\Facades\DB;

class RefundProcessor
{
    public function __construct(
        private readonly BillingSequence $sequence,
        private readonly InvoiceReconciler $reconciler,
        private readonly BillingEventStore $events,
    ) {}

    /**
     * @param  array{amount_cents:int,reason:string,idempotency_key:string,metadata?:array<string,mixed>|null,refunded_by?:int|null}  $data
     */
    public function refund(Payment $payment, array $data): Refund
    {
        return DB::transaction(function () use ($payment, $data): Refund {
            $lockedPayment = Payment::query()->lockForUpdate()->findOrFail($payment->id);
            $invoice = Invoice::query()->lockForUpdate()->findOrFail($lockedPayment->invoice_id);
            $existing = Refund::query()->where('idempotency_key', $data['idempotency_key'])->first();
            if ($existing) {
                if (
                    $existing->payment_id !== $lockedPayment->id
                    || $existing->amount_cents !== $data['amount_cents']
                    || $existing->reason !== $data['reason']
                ) {
                    throw new DomainException('The idempotency key was already used for a different refund.');
                }

                return $existing;
            }

            $alreadyRefunded = (int) $lockedPayment->refunds()->sum('amount_cents');
            $available = $lockedPayment->amount_cents - $alreadyRefunded;
            if ($data['amount_cents'] < 1 || $data['amount_cents'] > $available) {
                throw new DomainException('Refund must be positive and cannot exceed the refundable payment amount.');
            }

            $refund = Refund::query()->create([
                'tenant_id' => $lockedPayment->tenant_id,
                'branch_id' => $lockedPayment->branch_id,
                'invoice_id' => $invoice->id,
                'payment_id' => $lockedPayment->id,
                'refund_number' => $this->sequence->next('refund', 'REF'),
                'amount_cents' => $data['amount_cents'],
                'reason' => $data['reason'],
                'idempotency_key' => $data['idempotency_key'],
                'metadata' => $data['metadata'] ?? null,
                'refunded_at' => now(),
                'refunded_by' => $data['refunded_by'] ?? null,
            ]);

            $this->reconciler->reconcile($invoice);
            $this->events->record('PaymentRefunded', $refund, [
                'payment_id' => $lockedPayment->id,
                'invoice_id' => $invoice->id,
                'amount_cents' => $refund->amount_cents,
            ]);

            return $refund;
        });
    }
}
