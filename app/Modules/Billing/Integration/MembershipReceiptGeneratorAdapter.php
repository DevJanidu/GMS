<?php

namespace App\Modules\Billing\Integration;

use App\Modules\Billing\Models\Payment;
use App\Modules\Billing\Services\ReceiptGeneratorService;
use App\Modules\Membership\Contracts\ReceiptGenerator;

final readonly class MembershipReceiptGeneratorAdapter implements ReceiptGenerator
{
    public function __construct(private ReceiptGeneratorService $receipts) {}

    public function generateForPayment(int $paymentId): string
    {
        $payment = Payment::query()->with('receipt')->findOrFail($paymentId);

        return $this->receipts->generate($payment)->receipt_number;
    }
}
