<?php

use App\Modules\Billing\Enums\DiscountType;
use App\Modules\Billing\Services\InvoiceCalculator;

it('calculates fixed discounts joining fees tax and grand total in minor units', function () {
    $totals = app(InvoiceCalculator::class)->calculate(
        [
            ['quantity' => 2, 'unit_price_cents' => 5000],
            ['quantity' => 1, 'unit_price_cents' => 2500],
        ],
        DiscountType::Fixed,
        1500,
        1000,
        1000,
    );

    expect($totals->subtotalCents)->toBe(12500)
        ->and($totals->discountCents)->toBe(1500)
        ->and($totals->joiningFeeCents)->toBe(1000)
        ->and($totals->taxCents)->toBe(1200)
        ->and($totals->grandTotalCents)->toBe(13200);
});

it('calculates percentage discounts using basis points and deterministic rounding', function () {
    $totals = app(InvoiceCalculator::class)->calculate(
        [['quantity' => 1, 'unit_price_cents' => 999]],
        DiscountType::Percentage,
        1250,
    );

    expect($totals->discountCents)->toBe(125)
        ->and($totals->grandTotalCents)->toBe(874);
});

it('rejects discounts greater than the subtotal', function () {
    app(InvoiceCalculator::class)->calculate(
        [['quantity' => 1, 'unit_price_cents' => 100]],
        DiscountType::Fixed,
        101,
    );
})->throws(InvalidArgumentException::class);
