<?php

namespace App\Modules\Membership\Events;

use App\Modules\Membership\Models\Membership;
use Illuminate\Foundation\Events\Dispatchable;

/**
 * One of the domain events named in SRS B.5. Notification/Report modules
 * (Phase 3) listen to these by fully-qualified class name rather than
 * Membership modifying their controllers directly (SRS Rule 6). See
 * INTEGRATION_NOTES.md for the exact class names/payloads to wire up.
 */
class MembershipCreated
{
    use Dispatchable;

    public function __construct(public readonly Membership $membership) {}
}
