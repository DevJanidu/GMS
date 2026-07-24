<?php

namespace App\Modules\Notification\Services;

use App\Models\Member;
use App\Modules\Notification\Contracts\NotificationDispatcher;
use App\Modules\Notification\Contracts\NotificationTemplateRenderer;
use App\Modules\Notification\DTOs\NotificationEvent;
use App\Modules\Notification\Jobs\DeliverNotificationJob;
use App\Modules\Notification\Models\MemberNotificationPreference;
use App\Modules\Notification\Models\NotificationDelivery;
use App\Modules\Notification\Models\NotificationRule;
use App\Modules\Notification\Models\NotificationTemplate;
use Carbon\CarbonImmutable;

final class DatabaseNotificationDispatcher implements NotificationDispatcher
{
    public function __construct(private readonly NotificationTemplateRenderer $renderer) {}

    public function dispatchEvent(NotificationEvent $event): array
    {
        $member = Member::withoutGlobalScopes()
            ->where('tenant_id', $event->tenantId)
            ->find($event->memberId);

        if (! $member) {
            return [];
        }

        $deliveryIds = NotificationRule::withoutGlobalScopes()
            ->where('tenant_id', $event->tenantId)
            ->where('event_type', $event->eventType)
            ->where('status', 'active')
            ->where(fn ($query) => $query->whereNull('branch_id')
                ->when($event->branchId, fn ($inner) => $inner->orWhere('branch_id', $event->branchId)))
            ->orderBy('id')
            ->get()
            ->map(function (NotificationRule $rule) use ($event, $member) {
                $template = NotificationTemplate::withoutGlobalScopes()
                    ->where('tenant_id', $event->tenantId)
                    ->whereKey($rule->template_id)
                    ->where('status', 'active')
                    ->first();

                if (! $template || ! $this->preferenceAllows($event, $rule->channel)) {
                    return null;
                }

                $recipient = match ($rule->channel) {
                    'in_app' => 'member:'.$member->id,
                    'email' => $member->email,
                    'sms', 'whatsapp' => $member->phone,
                    default => null,
                };

                if (! is_string($recipient) || trim($recipient) === '') {
                    return null;
                }

                $allowedVariables = array_map('strval', $template->variables ?? []);
                $rendered = $this->renderer->render(
                    $template,
                    array_intersect_key($event->variables, array_flip($allowedVariables)),
                );
                $idempotencyKey = hash('sha256', implode('|', [
                    $event->sourceEventId, $rule->id, 'member', $member->id, $rule->channel,
                ]));
                $scheduledAt = $rule->offset_minutes > 0
                    ? $event->occurredAt->addMinutes($rule->offset_minutes)
                    : CarbonImmutable::now();

                $delivery = NotificationDelivery::withoutGlobalScopes()->firstOrCreate(
                    ['tenant_id' => $event->tenantId, 'idempotency_key' => $idempotencyKey],
                    [
                        'branch_id' => $event->branchId,
                        'template_id' => $template->id,
                        'rule_id' => $rule->id,
                        'member_id' => $member->id,
                        'channel' => $rule->channel,
                        'recipient' => $recipient,
                        'status' => 'queued',
                        'scheduled_at' => $scheduledAt,
                        'payload' => [
                            'event_type' => $event->eventType,
                            'title' => $rendered->subject ?? $template->name,
                            'body' => $rendered->body,
                        ],
                    ],
                );

                if ($delivery->wasRecentlyCreated) {
                    DeliverNotificationJob::dispatch($event->tenantId, $delivery->id)
                        ->delay($scheduledAt);
                }

                return $delivery->id;
            })
            ->filter()
            ->values()
            ->all();

        return array_values($deliveryIds);
    }

    /**
     * Create a delivery from an already validated announcement/template.
     *
     * @param  array<string, scalar|null>  $variables
     */
    public function dispatchDirect(
        int $tenantId,
        ?int $branchId,
        int $memberId,
        NotificationTemplate $template,
        string $channel,
        string $recipient,
        string $idempotencyKey,
        array $variables,
        ?int $announcementId = null,
        ?CarbonImmutable $scheduledAt = null,
    ): ?NotificationDelivery {
        if (! $this->preferenceAllowsForMember($tenantId, $memberId, 'ManualAnnouncement', $channel)) {
            return null;
        }

        $rendered = $this->renderer->render($template, $variables);
        $delivery = NotificationDelivery::withoutGlobalScopes()->firstOrCreate(
            ['tenant_id' => $tenantId, 'idempotency_key' => $idempotencyKey],
            [
                'branch_id' => $branchId,
                'template_id' => $template->id,
                'announcement_id' => $announcementId,
                'member_id' => $memberId,
                'channel' => $channel,
                'recipient' => $recipient,
                'status' => 'queued',
                'scheduled_at' => $scheduledAt ?? now(),
                'payload' => ['event_type' => 'ManualAnnouncement', 'title' => $rendered->subject, 'body' => $rendered->body],
            ],
        );

        if ($delivery->wasRecentlyCreated) {
            DeliverNotificationJob::dispatch($tenantId, $delivery->id)->delay($scheduledAt ?? now());
        }

        return $delivery;
    }

    private function preferenceAllows(NotificationEvent $event, string $channel): bool
    {
        return $this->preferenceAllowsForMember(
            $event->tenantId,
            $event->memberId,
            $event->eventType,
            $channel,
        );
    }

    private function preferenceAllowsForMember(
        int $tenantId,
        int $memberId,
        string $notificationType,
        string $channel,
    ): bool {
        $preference = MemberNotificationPreference::withoutGlobalScopes()
            ->where('tenant_id', $tenantId)
            ->where('member_id', $memberId)
            ->where('channel', $channel)
            ->whereIn('notification_type', [$notificationType, '*'])
            ->orderByRaw('CASE WHEN notification_type = ? THEN 0 ELSE 1 END', [$notificationType])
            ->first();

        return $preference?->enabled ?? true;
    }
}
