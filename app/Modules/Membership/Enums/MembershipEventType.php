<?php

namespace App\Modules\Membership\Enums;

enum MembershipEventType: string
{
    case Created = 'created';
    case Activated = 'activated';
    case Renewed = 'renewed';
    case Frozen = 'frozen';
    case Resumed = 'resumed';
    case Suspended = 'suspended';
    case Reactivated = 'reactivated';
    case Cancelled = 'cancelled';
    case ExpiringSoon = 'expiring_soon';
    case Expired = 'expired';
    case ReminderRequested = 'reminder_requested';

    public function label(): string
    {
        return match ($this) {
            self::Created => 'Created',
            self::Activated => 'Activated',
            self::Renewed => 'Renewed',
            self::Frozen => 'Frozen',
            self::Resumed => 'Resumed',
            self::Suspended => 'Suspended',
            self::Reactivated => 'Reactivated',
            self::Cancelled => 'Cancelled',
            self::ExpiringSoon => 'Expiring soon',
            self::Expired => 'Expired',
            self::ReminderRequested => 'Reminder requested',
        };
    }
}
