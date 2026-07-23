<?php

namespace App\Modules\Membership\Contracts;

use App\Modules\Membership\DTOs\PaymentResult;

/**
 * Named in SRS B.5. Membership calls this to record an optional initial
 * payment taken at the point of sale — it never writes to Billing's
 * payments table directly. See FakeInvoiceCreator's sibling
 * Testing\FakePaymentRecorder for the seam used until Billing's worktree
 * binds its real implementation (see INTEGRATION_NOTES.md).
 */
interface PaymentRecorder
{
    public function recordForInvoice(int $invoiceId, float $amount, string $method): PaymentResult;
}
