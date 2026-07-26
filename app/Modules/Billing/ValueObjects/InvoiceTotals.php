<?php

namespace App\Modules\Billing\ValueObjects;

final readonly class InvoiceTotals
{
    public function __construct(
        public int $subtotalCents,
        public int $discountCents,
        public int $taxCents,
        public int $joiningFeeCents,
        public int $grandTotalCents,
    ) {}
}
