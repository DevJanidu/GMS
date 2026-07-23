<?php

use App\Enums\DurationUnit;
use App\Models\Plan;
use App\Modules\Membership\Services\MembershipDateCalculatorService;
use Carbon\CarbonImmutable;

it('calculates expiry and grace dates from a plan snapshot', function () {
    $plan = new Plan([
        'duration_value' => 3,
        'duration_unit' => DurationUnit::Months,
        'access_rules' => ['grace_days_allowed' => 10],
    ]);

    $calculator = new MembershipDateCalculatorService;
    $startsOn = CarbonImmutable::parse('2026-01-15');

    $dates = $calculator->calculate($plan, $startsOn);

    expect($dates->startsOn->toDateString())->toBe('2026-01-15');
    expect($dates->expiresOn->toDateString())->toBe('2026-04-15');
    expect($dates->graceDays)->toBe(10);
    expect($dates->graceEndsOn->toDateString())->toBe('2026-04-25');
});

it('falls back to the configured default grace period when the plan has none', function () {
    config(['membership.default_grace_days' => 5]);

    $plan = new Plan([
        'duration_value' => 1,
        'duration_unit' => DurationUnit::Weeks,
        'access_rules' => [],
    ]);

    $calculator = new MembershipDateCalculatorService;
    $dates = $calculator->calculate($plan, CarbonImmutable::parse('2026-01-01'));

    expect($dates->expiresOn->toDateString())->toBe('2026-01-08');
    expect($dates->graceDays)->toBe(5);
    expect($dates->graceEndsOn->toDateString())->toBe('2026-01-13');
});
