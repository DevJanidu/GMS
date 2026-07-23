<?php

namespace App\Modules\Membership\Testing;

use App\Modules\Membership\Contracts\ReceiptGenerator;

/**
 * Fake seam for ReceiptGenerator — see FakeInvoiceCreator for the rationale.
 * Billing's worktree binds the real implementation at integration merge.
 */
class FakeReceiptGenerator implements ReceiptGenerator
{
    public function generateForPayment(int $paymentId): string
    {
        return "fake-receipt-{$paymentId}";
    }
}
