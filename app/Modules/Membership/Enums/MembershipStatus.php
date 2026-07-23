<?php

namespace App\Modules\Membership\Enums;

enum MembershipStatus: string
{
    case Pending = 'pending';
    case Active = 'active';
    case Frozen = 'frozen';
    case Suspended = 'suspended';
    case Cancelled = 'cancelled';
    case Expired = 'expired';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Active => 'Active',
            self::Frozen => 'Frozen',
            self::Suspended => 'Suspended',
            self::Cancelled => 'Cancelled',
            self::Expired => 'Expired',
        };
    }

    public function isTerminal(): bool
    {
        return $this === self::Cancelled || $this === self::Expired;
    }

    /**
     * Statuses a membership can be reactivated from. Cancelled and Expired
     * are terminal by design: a lapsed or cancelled membership is replaced
     * by a new sale/renewal rather than reopened in place.
     */
    public function isEligibleForReactivation(): bool
    {
        return $this === self::Frozen || $this === self::Suspended;
    }
}
