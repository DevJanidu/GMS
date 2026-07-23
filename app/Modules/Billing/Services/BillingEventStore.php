<?php

namespace App\Modules\Billing\Services;

use App\Modules\Billing\Events\BillingEventPublished;
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
            BillingEvent::withoutGlobalScopes()->whereKey($event->id)->update(['published_at' => now()]);
        });

        return $event;
    }
}
