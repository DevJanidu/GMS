<?php

namespace App\Modules\Billing\Services;

use App\Modules\Billing\Enums\DiscountType;
use App\Modules\Billing\ValueObjects\InvoiceTotals;
use InvalidArgumentException;

class InvoiceCalculator
{
    /**
     * @param  list<array{quantity: int, unit_price_cents: int}>  $items
     */
    public function calculate(
        array $items,
        ?DiscountType $discountType = null,
        int $discountValue = 0,
        int $taxRateBasisPoints = 0,
        int $joiningFeeCents = 0,
    ): InvoiceTotals {
        if ($items === []) {
            throw new InvalidArgumentException('An invoice requires at least one item.');
        }

        $subtotal = 0;
        foreach ($items as $item) {
            if ($item['quantity'] < 1 || $item['unit_price_cents'] < 0) {
                throw new InvalidArgumentException('Item quantity and price are invalid.');
            }
            $subtotal += $item['quantity'] * $item['unit_price_cents'];
        }

        $discount = match ($discountType) {
            DiscountType::Fixed => $discountValue,
            DiscountType::Percentage => intdiv(($subtotal * $discountValue) + 5000, 10000),
            null => 0,
        };

        if ($discount < 0 || $discount > $subtotal) {
            throw new InvalidArgumentException('Discount cannot exceed the item subtotal.');
        }
        if ($discountType === DiscountType::Percentage && $discountValue > 10000) {
            throw new InvalidArgumentException('Percentage discount cannot exceed 100%.');
        }
        if ($taxRateBasisPoints < 0 || $taxRateBasisPoints > 10000 || $joiningFeeCents < 0) {
            throw new InvalidArgumentException('Tax rate or joining fee is invalid.');
        }

        $taxable = $subtotal - $discount + $joiningFeeCents;
        $tax = intdiv(($taxable * $taxRateBasisPoints) + 5000, 10000);

        return new InvoiceTotals(
            $subtotal,
            $discount,
            $tax,
            $joiningFeeCents,
            $taxable + $tax,
        );
    }
}
