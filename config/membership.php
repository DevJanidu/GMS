<?php

return [
    // Used when a plan's access_rules snapshot doesn't specify its own
    // grace_days_allowed value.
    'default_grace_days' => env('MEMBERSHIP_DEFAULT_GRACE_DAYS', 7),

    // A membership is considered "expiring soon" once its expires_on date
    // falls within this many days of today.
    'expiring_soon_within_days' => env('MEMBERSHIP_EXPIRING_SOON_DAYS', 7),
];
