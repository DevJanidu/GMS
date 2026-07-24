<?php

namespace App\Modules\Notification\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\MemberPortal\Models\MemberPortalAccount;
use App\Modules\Notification\Models\InAppNotification;
use App\Shared\Support\ApiResponse;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationCenterController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifications = $this->ownedQuery($request)
            ->when($request->boolean('unread'), fn ($query) => $query->whereNull('read_at'))
            ->latest()->paginate(min(max($request->integer('per_page', 20), 1), 100));

        return ApiResponse::paginated($notifications->through(fn (InAppNotification $item) => $this->serialize($item)));
    }

    public function unreadCount(Request $request): JsonResponse
    {
        return ApiResponse::success(['count' => $this->ownedQuery($request)->whereNull('read_at')->count()]);
    }

    public function read(InAppNotification $notification, Request $request): JsonResponse
    {
        $this->assertOwned($notification, $request);
        $notification->forceFill(['read_at' => now()])->save();

        return ApiResponse::success($this->serialize($notification));
    }

    public function unread(InAppNotification $notification, Request $request): JsonResponse
    {
        $this->assertOwned($notification, $request);
        $notification->forceFill(['read_at' => null])->save();

        return ApiResponse::success($this->serialize($notification));
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $count = $this->ownedQuery($request)->whereNull('read_at')->update(['read_at' => now()]);

        return ApiResponse::success(['updated' => $count]);
    }

    /** @return Builder<InAppNotification> */
    private function ownedQuery(Request $request): Builder
    {
        $account = MemberPortalAccount::query()
            ->where('user_id', $request->user()->id)
            ->where('status', 'active')->first();

        return InAppNotification::query()
            ->whereNull('cancelled_at')
            ->where(function ($query) use ($request, $account) {
                $query->where('user_id', $request->user()->id);
                if ($account) {
                    $query->orWhere('member_id', $account->member_id);
                }
            });
    }

    private function assertOwned(InAppNotification $notification, Request $request): void
    {
        abort_unless($this->ownedQuery($request)->whereKey($notification->id)->exists(), 404);
    }

    /** @return array<string, mixed> */
    private function serialize(InAppNotification $notification): array
    {
        return [
            'id' => $notification->id, 'type' => $notification->type,
            'title' => $notification->title, 'body' => $notification->body,
            'data' => $notification->data ?? [], 'read_at' => $notification->read_at,
            'created_at' => $notification->created_at,
        ];
    }
}
