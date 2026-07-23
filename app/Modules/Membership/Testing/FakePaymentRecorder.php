<?php

namespace App\Modules\Membership\Testing;

use App\Modules\Membership\Contracts\PaymentRecorder;
use App\Modules\Membership\DTOs\PaymentResult;

/**
 * Fake seam for PaymentRecorder — see FakeInvoiceCreator for the rationale.
 * Billing's worktree binds the real implementation at integration merge.
 */
class FakePaymentRecorder implements PaymentRecorder
{
    private static int $sequence = 900000;

    public function recordForInvoice(int $invoiceId, float $amount, string $method): PaymentResult
    {
        return new PaymentResult(
            paymentId: ++self::$sequence,
            amountPaid: round($amount, 2),
            remainingBalance: 0.0,
        );
    }
}
