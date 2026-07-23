<?php

namespace App\Modules\Membership\DTOs;

/**
 * Billing's response to a membership invoice request. Membership only ever
 * stores `invoiceId` (a plain reference, not a foreign key — see the
 * memberships migration) and the amounts needed to decide whether the sale
 * activates immediately.
 */
final readonly class InvoiceResult
{
    public function __construct(
        public int $invoiceId,
        public float $totalAmount,
        public float $amountPaid,
        public float $balance,
    ) {}

    public function isPaidInFull(): bool
    {
        return $this->balance <= 0.0;
    }
}
