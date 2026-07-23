<?php

namespace App\Modules\Billing\Enums;

enum DiscountType: string
{
    case Fixed = 'fixed';
    case Percentage = 'percentage';
}
