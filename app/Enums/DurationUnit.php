<?php

namespace App\Enums;

enum DurationUnit: string
{
    case Days = 'days';
    case Weeks = 'weeks';
    case Months = 'months';
    case Years = 'years';

    public function label(): string
    {
        return match ($this) {
            self::Days => 'Day(s)',
            self::Weeks => 'Week(s)',
            self::Months => 'Month(s)',
            self::Years => 'Year(s)',
        };
    }
}
