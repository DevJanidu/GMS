<?php

namespace App\Modules\Billing\Enums;

enum InvoiceStatus: string
{
    case Open = 'open';
    case PartiallyPaid = 'partially_paid';
    case Paid = 'paid';
    case PartiallyRefunded = 'partially_refunded';
    case Refunded = 'refunded';
    case Void = 'void';
}
