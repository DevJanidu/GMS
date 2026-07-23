<?php

namespace App\Modules\Membership\DTOs;

final readonly class PaymentResult
{
    public function __construct(
        public int $paymentId,
        public float $amountPaid,
        public float $remainingBalance,
    ) {}
}
