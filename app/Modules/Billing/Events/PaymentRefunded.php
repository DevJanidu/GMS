<?php

namespace App\Modules\Billing\Events;

use Illuminate\Foundation\Events\Dispatchable;

final readonly class PaymentRefunded
{
    use Dispatchable;

    public function __construct(
        public string $eventId,
        public string $occurredAt,
        public int $tenantId,
        public ?int $branchId,
        public int $refundId,
        public int $paymentId,
        public int $invoiceId,
        public int $amountCents,
    ) {}
}
