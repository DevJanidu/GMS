<?php

namespace App\Modules\Notification\Listeners;

use App\Modules\Membership\Models\Membership;
use App\Modules\Notification\Contracts\NotificationDispatcher;
use App\Modules\Notification\DTOs\NotificationEvent;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;

final class MembershipNotificationListener
{
    public function __construct(private readonly NotificationDispatcher $dispatcher) {}

    public function handle(object $event): void
    {
        $membership = $event->membership ?? null;
        if (! $membership instanceof Membership) {
            return;
        }

        $member = $membership->member()->withoutGlobalScopes()->first();
        $eventType = class_basename($event);
        $sourceId = hash('sha256', implode('|', [
            $eventType, $membership->tenant_id, $membership->id,
            $membership->updated_at?->toIso8601String() ?? (string) Str::uuid(),
        ]));

        $this->dispatcher->dispatchEvent(new NotificationEvent(
            $sourceId,
            $eventType,
            $membership->tenant_id,
            $membership->branch_id,
            $membership->member_id,
            [
                'member_name' => $member?->fullName(),
                'membership_id' => $membership->id,
                'plan_name' => $membership->plan_name_snapshot,
                'starts_on' => $membership->starts_on->toDateString(),
                'expires_on' => $membership->expires_on->toDateString(),
                'status' => $membership->status->value,
            ],
            CarbonImmutable::now(),
        ));
    }
}
