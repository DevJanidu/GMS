<?php

namespace App\Modules\Notification\Listeners;

use App\Models\Member;
use App\Modules\Notification\Contracts\NotificationDispatcher;
use App\Modules\Notification\DTOs\NotificationEvent;
use Carbon\CarbonImmutable;

/**
 * Integration-safe listener for scalar MemberRegistered/Attendance events.
 * It intentionally accepts object so this branch does not couple to W2 classes.
 */
final class ScalarDomainNotificationListener
{
    public function __construct(private readonly NotificationDispatcher $dispatcher) {}

    public function handle(object $event): void
    {
        $tenantId = (int) ($event->tenantId ?? 0);
        $memberId = (int) ($event->memberId ?? 0);
        $sourceId = (string) ($event->eventId ?? $event->requestId ?? '');
        if ($tenantId < 1 || $memberId < 1) {
            return;
        }
        $member = Member::withoutGlobalScopes()
            ->where('tenant_id', $tenantId)
            ->find($memberId);
        if (! $member) {
            return;
        }
        $sourceId = $sourceId !== ''
            ? $sourceId
            : hash('sha256', class_basename($event).'|'.$tenantId.'|'.$memberId);

        $variables = [
            'member_name' => $member->fullName(),
            'member_number' => $member->member_number,
            'attendance_record_id' => isset($event->attendanceRecordId) ? (int) $event->attendanceRecordId : null,
            'membership_id' => isset($event->membershipId) ? (int) $event->membershipId : null,
            'source' => isset($event->source) ? (string) $event->source : null,
            'result' => isset($event->result) ? (string) $event->result : null,
            'reason_code' => isset($event->reasonCode) ? (string) $event->reasonCode : null,
            'override_applied' => isset($event->overrideApplied) ? $event->overrideApplied : null,
            'registered_by' => isset($event->registeredBy) ? (int) $event->registeredBy : null,
        ];

        $this->dispatcher->dispatchEvent(new NotificationEvent(
            $sourceId, class_basename($event), $tenantId,
            isset($event->branchId) ? (int) $event->branchId : null,
            $memberId,
            $variables,
            CarbonImmutable::parse($event->occurredAt ?? now()),
        ));
    }
}
