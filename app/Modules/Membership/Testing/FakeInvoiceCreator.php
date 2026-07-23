<?php

namespace App\Modules\Membership\Testing;

use App\Modules\Membership\Contracts\InvoiceCreator;
use App\Modules\Membership\DTOs\InvoiceResult;
use App\Modules\Membership\DTOs\MembershipInvoiceData;

/**
 * Module-local fake/adapter seam for InvoiceCreator, used both in tests and
 * as the default binding during parallel development (Billing's worktree
 * doesn't exist yet in this baseline). It never writes to a real invoices
 * table — it fabricates a deterministic result so Membership's sale/renewal
 * orchestration can be built and tested end-to-end today.
 *
 * Replace the binding in MembershipServiceProvider with Billing's real
 * implementation at the Phase 2 integration merge (see INTEGRATION_NOTES.md).
 */
class FakeInvoiceCreator implements InvoiceCreator
{
    private static int $sequence = 900000;

    public function createForMembership(MembershipInvoiceData $data): InvoiceResult
    {
        $total = round($data->price + $data->joiningFee, 2);
        $paid = round(min($data->initialPayment ?? 0.0, $total), 2);

        return new InvoiceResult(
            invoiceId: self::nextId(),
            totalAmount: $total,
            amountPaid: $paid,
            balance: round($total - $paid, 2),
        );
    }

    private static function nextId(): int
    {
        return ++self::$sequence;
    }
}
