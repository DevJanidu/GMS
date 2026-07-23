<?php

namespace App\Modules\Membership\Contracts;

use App\Modules\Membership\DTOs\InvoiceResult;
use App\Modules\Membership\DTOs\MembershipInvoiceData;

/**
 * Named in SRS B.5. Membership must never create invoice/payment/receipt
 * rows itself — it calls this contract and Billing's worktree binds the
 * real implementation. See App\Modules\Membership\Testing\FakeInvoiceCreator
 * for the seam used during parallel development/tests, and
 * INTEGRATION_NOTES.md for the exact binding to swap in at merge time.
 */
interface InvoiceCreator
{
    public function createForMembership(MembershipInvoiceData $data): InvoiceResult;
}
