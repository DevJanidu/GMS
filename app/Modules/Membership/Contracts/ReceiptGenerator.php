<?php

namespace App\Modules\Membership\Contracts;

/**
 * Named in SRS B.5. Called after a payment is recorded during the
 * membership-sale orchestration; Billing's worktree binds the real
 * implementation once it exists (see INTEGRATION_NOTES.md).
 */
interface ReceiptGenerator
{
    public function generateForPayment(int $paymentId): string;
}
