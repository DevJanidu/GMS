<?php

namespace App\Modules\Membership\Services;

use App\Modules\Membership\Enums\MembershipEventType;
use App\Modules\Membership\Enums\MembershipStatus;
use App\Modules\Membership\Models\Membership;
use App\Modules\Membership\Models\MembershipEvent;

/**
 * Single place that appends to a membership's history. Every lifecycle
 * action (sell, renew, freeze, ...) must go through this instead of writing
 * to membership_events directly, so the audit trail stays consistent.
 */
class MembershipEventRecorder
{
    /**
     * @param  array<string, mixed>  $metadata
     */
    public function record(
        Membership $membership,
        MembershipEventType $type,
        ?MembershipStatus $from,
        ?MembershipStatus $to,
        ?int $actorId = null,
        array $metadata = [],
    ): MembershipEvent {
        return MembershipEvent::create([
            'tenant_id' => $membership->tenant_id,
            'membership_id' => $membership->id,
            'type' => $type,
            'from_status' => $from?->value,
            'to_status' => $to?->value,
            'occurred_at' => now(),
            'actor_id' => $actorId,
            'metadata' => $metadata,
        ]);
    }
}
