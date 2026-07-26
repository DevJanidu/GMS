<?php

namespace App\Modules\Billing\Services;

use App\Modules\Billing\Enums\InvoiceStatus;
use App\Modules\Billing\Models\Invoice;

class InvoiceReconciler
{
    public function reconcile(Invoice $invoice): Invoice
    {
        $grossPaid = (int) $invoice->payments()->sum('amount_cents');
        $refunded = (int) $invoice->refunds()->sum('amount_cents');
        $netPaid = $grossPaid - $refunded;
        $balance = max(0, $invoice->grand_total_cents - $netPaid);

        $status = match (true) {
            $invoice->isVoid() => InvoiceStatus::Void,
            $refunded > 0 && $netPaid === 0 => InvoiceStatus::Refunded,
            $refunded > 0 => InvoiceStatus::PartiallyRefunded,
            $netPaid >= $invoice->grand_total_cents => InvoiceStatus::Paid,
            $netPaid > 0 => InvoiceStatus::PartiallyPaid,
            default => InvoiceStatus::Open,
        };

        $invoice->forceFill([
            'amount_paid_cents' => $grossPaid,
            'amount_refunded_cents' => $refunded,
            'balance_due_cents' => $balance,
            'status' => $status,
        ])->save();

        return $invoice->refresh();
    }
}
