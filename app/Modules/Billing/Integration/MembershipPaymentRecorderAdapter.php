<?php

namespace App\Modules\Billing\Integration;

use App\Modules\Billing\Models\Invoice;
use App\Modules\Billing\Services\PaymentRecorderService;
use App\Modules\Membership\Contracts\PaymentRecorder;
use App\Modules\Membership\DTOs\PaymentResult;

final readonly class MembershipPaymentRecorderAdapter implements PaymentRecorder
{
    public function __construct(private PaymentRecorderService $payments) {}

    public function recordForInvoice(int $invoiceId, float $amount, string $method): PaymentResult
    {
        $invoice = Invoice::query()->findOrFail($invoiceId);
        $payment = $this->payments->record($invoice, [
            'amount_cents' => (int) round($amount * 100, 0, PHP_ROUND_HALF_UP),
            'method' => $method,
            'idempotency_key' => "membership:invoice:{$invoiceId}:initial-payment",
            'metadata' => ['source' => 'membership_sale'],
        ]);
        $remainingBalance = (int) $payment->invoice()->value('balance_due_cents');

        return new PaymentResult(
            paymentId: $payment->id,
            amountPaid: $payment->amount_cents / 100,
            remainingBalance: $remainingBalance / 100,
        );
    }
}
