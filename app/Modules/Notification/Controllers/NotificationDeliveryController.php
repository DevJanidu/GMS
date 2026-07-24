<?php

namespace App\Modules\Notification\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\AccessControl\Services\AuditLogger;
use App\Modules\Notification\Jobs\DeliverNotificationJob;
use App\Modules\Notification\Models\NotificationDelivery;
use App\Modules\Notification\Services\NotificationAuthorizer;
use App\Shared\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationDeliveryController extends Controller
{
    public function index(Request $request, NotificationAuthorizer $authorizer): JsonResponse
    {
        $branchId = $request->integer('branch_id') ?: null;
        $authorizer->authorize($request->user(), 'notifications.logs.view', $branchId);
        $deliveries = NotificationDelivery::query()
            ->when($branchId, fn ($q, $id) => $q->where('branch_id', $id))
            ->when($request->string('status')->toString(), fn ($q, $status) => $q->where('status', $status))
            ->when($request->string('channel')->toString(), fn ($q, $channel) => $q->where('channel', $channel))
            ->with(['member:id,member_number,first_name,last_name', 'attempts'])
            ->latest()->paginate(min(max($request->integer('per_page', 20), 1), 100));

        return ApiResponse::paginated($deliveries->through(fn (NotificationDelivery $delivery) => $this->serialize($delivery)));
    }

    public function show(NotificationDelivery $notificationDelivery, Request $request, NotificationAuthorizer $authorizer): JsonResponse
    {
        $authorizer->authorize($request->user(), 'notifications.logs.view', $notificationDelivery->branch_id);

        return ApiResponse::success($this->serialize($notificationDelivery->load('attempts')));
    }

    public function retry(NotificationDelivery $notificationDelivery, Request $request, NotificationAuthorizer $authorizer, AuditLogger $audit): JsonResponse
    {
        $authorizer->authorize($request->user(), 'notifications.logs.retry', $notificationDelivery->branch_id);
        abort_unless($notificationDelivery->status === 'failed', 409, 'Only failed deliveries can be retried.');
        $notificationDelivery->forceFill(['status' => 'queued', 'failed_at' => null, 'failure_reason' => null])->save();
        DeliverNotificationJob::dispatch($notificationDelivery->tenant_id, $notificationDelivery->id);
        $audit->log($request->user(), 'notification_delivery.retried', $notificationDelivery, [], [], [], [], $notificationDelivery->branch_id);

        return ApiResponse::success($this->serialize($notificationDelivery), 'Notification retry queued.');
    }

    /** @return array<string, mixed> */
    private function serialize(NotificationDelivery $delivery): array
    {
        return [
            'id' => $delivery->id, 'branch_id' => $delivery->branch_id,
            'member_id' => $delivery->member_id, 'channel' => $delivery->channel,
            'recipient' => preg_replace('/(?<=.).(?=[^@]*?@)/', '*', $delivery->recipient),
            'status' => $delivery->status, 'attempt_count' => $delivery->attempt_count,
            'scheduled_at' => $delivery->scheduled_at, 'sent_at' => $delivery->sent_at,
            'delivered_at' => $delivery->delivered_at, 'failed_at' => $delivery->failed_at,
            'failure_reason' => $delivery->failure_reason,
            'attempts' => $delivery->relationLoaded('attempts') ? $delivery->attempts : [],
        ];
    }
}
