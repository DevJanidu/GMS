<?php

namespace App\Modules\Notification\Listeners;

use App\Modules\Billing\Models\Invoice;
use App\Modules\Notification\Contracts\NotificationDispatcher;
use App\Modules\Notification\DTOs\NotificationEvent;
use Carbon\CarbonImmutable;

final class BillingNotificationListener
{
    public function __construct(private readonly NotificationDispatcher $dispatcher) {}

    public function handle(object $event): void
    {
        $eventType = (string) ($event->type ?? class_basename($event));
        if (! in_array($eventType, ['PaymentCompleted', 'PaymentRefunded'], true)) {
            return;
        }

        $payload = is_array($event->payload ?? null) ? $event->payload : [];
        $invoiceId = (int) ($event->invoiceId ?? $payload['invoice_id'] ?? 0);
        $invoice = Invoice::withoutGlobalScopes()
            ->where('tenant_id', $event->tenantId)->find($invoiceId);
        if (! $invoice?->member_id) {
            return;
        }

        $this->dispatcher->dispatchEvent(new NotificationEvent(
            $event->eventId,
            $eventType,
            $event->tenantId,
            $event->branchId,
            $invoice->member_id,
            [
                'invoice_number' => $invoice->invoice_number,
                'amount_cents' => (int) ($event->amountCents ?? $payload['amount_cents'] ?? 0),
                'payment_method' => (string) ($event->method ?? $payload['method'] ?? ''),
            ],
            CarbonImmutable::parse($event->occurredAt ?? now()),
        ));
    }
}
