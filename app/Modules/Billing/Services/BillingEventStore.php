<?php

namespace App\Modules\Billing\Services;

use App\Modules\Billing\Events\BillingEventPublished;
use App\Modules\Billing\Events\PaymentCompleted;
use App\Modules\Billing\Events\PaymentRefunded;
use App\Modules\Billing\Models\BillingEvent;
use App\Modules\Billing\Models\Invoice;
use App\Modules\Billing\Models\Payment;
use App\Modules\Billing\Models\Refund;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class BillingEventStore
{
    /**
     * @param  array<string, mixed>  $payload
     */
    public function record(string $type, Model $aggregate, array $payload = []): BillingEvent
    {
        /** @var Invoice|Payment|Refund $aggregate */
        $event = BillingEvent::query()->create([
            'tenant_id' => $aggregate->tenant_id,
            'branch_id' => $aggregate->branch_id,
            'event_type' => $type,
            'aggregate_type' => class_basename($aggregate),
            'aggregate_id' => $aggregate->getKey(),
            'payload' => $payload,
            'occurred_at' => now(),
        ]);

        DB::afterCommit(function () use ($event): void {
            event(new BillingEventPublished(
                $event->event_id,
                $event->event_type,
                $event->aggregate_type,
                $event->aggregate_id,
                $event->tenant_id,
                $event->branch_id,
                $event->payload,
            ));
            $this->publishTypedEvent($event);
            BillingEvent::withoutGlobalScopes()->whereKey($event->id)->update(['published_at' => now()]);
        });

        return $event;
    }

    private function publishTypedEvent(BillingEvent $event): void
    {
        $occurredAt = $event->occurred_at->toIso8601String();

        match ($event->event_type) {
            'PaymentCompleted' => PaymentCompleted::dispatch(
                eventId: $event->event_id,
                occurredAt: $occurredAt,
                tenantId: $event->tenant_id,
                branchId: $event->branch_id,
                paymentId: $event->aggregate_id,
                invoiceId: (int) $event->payload['invoice_id'],
                amountCents: (int) $event->payload['amount_cents'],
                method: (string) $event->payload['method'],
                receiptId: isset($event->payload['receipt_id'])
                    ? (int) $event->payload['receipt_id']
                    : null,
            ),
            'PaymentRefunded' => PaymentRefunded::dispatch(
                eventId: $event->event_id,
                occurredAt: $occurredAt,
                tenantId: $event->tenant_id,
                branchId: $event->branch_id,
                refundId: $event->aggregate_id,
                paymentId: (int) $event->payload['payment_id'],
                invoiceId: (int) $event->payload['invoice_id'],
                amountCents: (int) $event->payload['amount_cents'],
            ),
            default => null,
        };
    }
}
