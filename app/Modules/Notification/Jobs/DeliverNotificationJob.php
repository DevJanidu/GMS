<?php

namespace App\Modules\Notification\Jobs;

use App\Modules\Notification\Models\InAppNotification;
use App\Modules\Notification\Models\NotificationDelivery;
use App\Modules\Notification\Models\NotificationDeliveryAttempt;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable as FoundationQueueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use RuntimeException;
use Throwable;

final class DeliverNotificationJob implements ShouldQueue
{
    use FoundationQueueable, InteractsWithQueue, Queueable;

    public int $tries = 3;

    /** @var list<int> */
    public array $backoff = [10, 60, 300];

    public function __construct(public readonly int $tenantId, public readonly int $deliveryId) {}

    public function handle(): void
    {
        try {
            DB::transaction(function (): void {
                $delivery = NotificationDelivery::withoutGlobalScopes()
                    ->where('tenant_id', $this->tenantId)
                    ->lockForUpdate()
                    ->findOrFail($this->deliveryId);

                if (in_array($delivery->status, ['delivered', 'cancelled'], true)) {
                    return;
                }

                if (in_array($delivery->channel, ['sms', 'whatsapp'], true)) {
                    $this->recordPermanentFailure($delivery, $delivery->channel.'_provider_not_configured');

                    return;
                }

                $attempt = $delivery->attempt_count + 1;
                $delivery->forceFill(['status' => 'processing', 'attempt_count' => $attempt])->save();
                $payload = $delivery->payload ?? [];

                if ($delivery->channel === 'in_app') {
                    $notification = InAppNotification::withoutGlobalScopes()->create([
                        'tenant_id' => $delivery->tenant_id,
                        'branch_id' => $delivery->branch_id,
                        'member_id' => $delivery->member_id,
                        'type' => (string) ($payload['event_type'] ?? 'notification'),
                        'title' => (string) ($payload['title'] ?? 'Notification'),
                        'body' => (string) ($payload['body'] ?? ''),
                        'data' => [],
                    ]);
                    $delivery->notification_id = $notification->id;
                } elseif ($delivery->channel === 'email') {
                    Mail::raw((string) ($payload['body'] ?? ''), function ($message) use ($delivery, $payload) {
                        $message->to($delivery->recipient)
                            ->subject((string) ($payload['title'] ?? 'Gym notification'));
                    });
                } else {
                    throw new RuntimeException('Unsupported notification channel.');
                }

                $delivery->forceFill([
                    'status' => 'delivered',
                    'sent_at' => now(),
                    'delivered_at' => now(),
                    'failed_at' => null,
                    'failure_reason' => null,
                ])->save();

                NotificationDeliveryAttempt::withoutGlobalScopes()->create([
                    'tenant_id' => $delivery->tenant_id,
                    'delivery_id' => $delivery->id,
                    'attempt_number' => $attempt,
                    'status' => 'delivered',
                    'provider' => $delivery->channel === 'email' ? 'laravel-mail' : 'in-app',
                    'attempted_at' => now(),
                ]);
            });
        } catch (Throwable $exception) {
            $this->recordAttemptFailure('delivery_failed');
            throw $exception;
        }
    }

    public function failed(?Throwable $exception): void
    {
        $delivery = NotificationDelivery::withoutGlobalScopes()
            ->where('tenant_id', $this->tenantId)->find($this->deliveryId);

        if ($delivery && $delivery->status !== 'delivered') {
            $delivery->forceFill([
                'status' => 'failed',
                'failed_at' => now(),
                'failure_reason' => 'delivery_failed_after_retries',
            ])->save();
        }
    }

    private function recordPermanentFailure(NotificationDelivery $delivery, string $reason): void
    {
        $attempt = $delivery->attempt_count + 1;
        $delivery->forceFill([
            'status' => 'failed', 'attempt_count' => $attempt,
            'failed_at' => now(), 'failure_reason' => $reason,
        ])->save();
        NotificationDeliveryAttempt::withoutGlobalScopes()->create([
            'tenant_id' => $delivery->tenant_id, 'delivery_id' => $delivery->id,
            'attempt_number' => $attempt, 'status' => 'failed',
            'provider' => 'unconfigured', 'failure_reason' => $reason, 'attempted_at' => now(),
        ]);
    }

    private function recordAttemptFailure(string $reason): void
    {
        DB::transaction(function () use ($reason): void {
            $delivery = NotificationDelivery::withoutGlobalScopes()
                ->where('tenant_id', $this->tenantId)
                ->lockForUpdate()
                ->find($this->deliveryId);
            if (! $delivery || in_array($delivery->status, ['delivered', 'cancelled'], true)) {
                return;
            }

            $attempt = $delivery->attempt_count + 1;
            $delivery->forceFill([
                'status' => 'retrying',
                'attempt_count' => $attempt,
                'failure_reason' => $reason,
            ])->save();
            NotificationDeliveryAttempt::withoutGlobalScopes()->firstOrCreate(
                ['delivery_id' => $delivery->id, 'attempt_number' => $attempt],
                [
                    'tenant_id' => $delivery->tenant_id, 'status' => 'failed',
                    'provider' => $delivery->channel, 'failure_reason' => $reason, 'attempted_at' => now(),
                ],
            );
        });
    }
}
