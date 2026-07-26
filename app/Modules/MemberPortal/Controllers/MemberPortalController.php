<?php

namespace App\Modules\MemberPortal\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Attendance\Models\AttendanceRecord;
use App\Modules\Billing\Models\Invoice;
use App\Modules\Billing\Models\Payment;
use App\Modules\Billing\Models\Receipt;
use App\Modules\MemberPortal\Models\MemberPortalAccount;
use App\Modules\MemberPortal\Requests\MemberPortalListRequest;
use App\Modules\MemberPortal\Requests\UpdateMemberProfileRequest;
use App\Modules\MemberPortal\Resources\MemberPortalAttendanceResource;
use App\Modules\MemberPortal\Resources\MemberPortalMembershipResource;
use App\Modules\MemberPortal\Resources\MemberPortalNotificationResource;
use App\Modules\MemberPortal\Resources\MemberPortalPaymentResource;
use App\Modules\MemberPortal\Resources\MemberPortalProfileResource;
use App\Modules\MemberPortal\Resources\MemberPortalReceiptResource;
use App\Modules\MemberPortal\Services\MemberQrCardResolver;
use App\Modules\Membership\Models\Membership;
use App\Modules\Notification\Models\InAppNotification;
use App\Shared\Support\ApiResponse;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MemberPortalController extends Controller
{
    public function dashboard(Request $request): JsonResponse
    {
        $account = $this->account($request);
        $member = $account->member;
        $membership = $this->membershipFor($member->id);

        return ApiResponse::success([
            'profile' => (new MemberPortalProfileResource($member->loadMissing('branch')))->resolve(),
            'membership' => $membership
                ? (new MemberPortalMembershipResource($membership->loadMissing('branch')))->resolve()
                : null,
            'payment_count' => Payment::query()
                ->whereHas('invoice', fn (Builder $query) => $query->where('member_id', $member->id))
                ->count(),
            'outstanding_balance_cents' => (int) Invoice::query()
                ->where('member_id', $member->id)
                ->sum('balance_due_cents'),
            'attendance_count' => AttendanceRecord::query()->where('member_id', $member->id)->count(),
            'unread_notification_count' => $this->notificationQuery($account)->whereNull('read_at')->count(),
            'attendance_trend' => $this->attendanceTrend($member->id),
        ]);
    }

    public function profile(Request $request): JsonResponse
    {
        return ApiResponse::success(
            (new MemberPortalProfileResource($this->account($request)->member->loadMissing('branch')))->resolve(),
        );
    }

    public function updateProfile(UpdateMemberProfileRequest $request): JsonResponse
    {
        $member = $this->account($request)->member;
        $member->fill($request->validated())->save();
        $member->refresh()->loadMissing('branch');

        return ApiResponse::success(
            (new MemberPortalProfileResource($member))->resolve(),
            'Profile updated.',
        );
    }

    public function qrCard(Request $request, MemberQrCardResolver $resolver): JsonResponse
    {
        return ApiResponse::success($resolver->forMember($this->account($request)->member)->toArray());
    }

    public function membership(Request $request): JsonResponse
    {
        $membership = $this->membershipFor($this->account($request)->member_id);

        return ApiResponse::success(
            $membership
                ? (new MemberPortalMembershipResource($membership->loadMissing('branch')))->resolve()
                : null,
        );
    }

    public function payments(MemberPortalListRequest $request): JsonResponse
    {
        $memberId = $this->account($request)->member_id;
        $payments = Payment::query()
            ->with(['invoice', 'receipt'])
            ->withSum('refunds', 'amount_cents')
            ->whereHas('invoice', fn (Builder $query) => $query->where('member_id', $memberId))
            ->latest('paid_at')
            ->paginate($request->perPage());

        return ApiResponse::paginated(
            $payments->through(fn (Payment $payment) => (new MemberPortalPaymentResource($payment))->resolve()),
        );
    }

    public function receipts(MemberPortalListRequest $request): JsonResponse
    {
        $memberId = $this->account($request)->member_id;
        $receipts = Receipt::query()
            ->whereHas('invoice', fn (Builder $query) => $query->where('member_id', $memberId))
            ->latest('generated_at')
            ->paginate($request->perPage());

        return ApiResponse::paginated(
            $receipts->through(fn (Receipt $receipt) => (new MemberPortalReceiptResource($receipt))->resolve()),
        );
    }

    public function receipt(Request $request, string $receipt): JsonResponse
    {
        $memberId = $this->account($request)->member_id;
        $model = Receipt::query()
            ->where('public_id', $receipt)
            ->whereHas('invoice', fn (Builder $query) => $query->where('member_id', $memberId))
            ->firstOrFail();

        return ApiResponse::success((new MemberPortalReceiptResource($model))->resolve());
    }

    public function attendance(MemberPortalListRequest $request): JsonResponse
    {
        $records = AttendanceRecord::query()
            ->with('branch')
            ->where('member_id', $this->account($request)->member_id)
            ->latest('checked_in_at')
            ->paginate($request->perPage());

        return ApiResponse::paginated(
            $records->through(
                fn (AttendanceRecord $record) => (new MemberPortalAttendanceResource($record))->resolve(),
            ),
        );
    }

    public function notifications(MemberPortalListRequest $request): JsonResponse
    {
        $notifications = $this->notificationQuery($this->account($request))
            ->whereNull('cancelled_at')
            ->where(fn (Builder $query) => $query->whereNull('scheduled_at')->orWhere('scheduled_at', '<=', now()))
            ->latest()
            ->paginate($request->perPage());

        return ApiResponse::paginated(
            $notifications->through(
                fn (InAppNotification $notification) => (new MemberPortalNotificationResource($notification))->resolve(),
            ),
        );
    }

    public function markNotificationRead(Request $request, string $notification): JsonResponse
    {
        $model = $this->notificationQuery($this->account($request))
            ->where('id', $notification)
            ->firstOrFail();

        if ($model->read_at === null) {
            $model->forceFill(['read_at' => now()])->save();
        }

        return ApiResponse::success((new MemberPortalNotificationResource($model))->resolve());
    }

    public function markNotificationUnread(Request $request, string $notification): JsonResponse
    {
        $model = $this->notificationQuery($this->account($request))
            ->where('id', $notification)
            ->firstOrFail();

        if ($model->read_at !== null) {
            $model->forceFill(['read_at' => null])->save();
        }

        return ApiResponse::success((new MemberPortalNotificationResource($model))->resolve());
    }

    public function markAllNotificationsRead(Request $request): JsonResponse
    {
        $updated = $this->notificationQuery($this->account($request))
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return ApiResponse::success(['updated' => $updated]);
    }

    private function account(Request $request): MemberPortalAccount
    {
        /** @var MemberPortalAccount $account */
        $account = $request->attributes->get('memberPortalAccount');

        return $account;
    }

    private function membershipFor(int $memberId): ?Membership
    {
        return Membership::query()
            ->where('member_id', $memberId)
            ->orderByRaw("case when status in ('active', 'frozen', 'suspended') then 0 else 1 end")
            ->latest('starts_on')
            ->first();
    }

    /**
     * @return list<array{date: string, visits: int}>
     */
    private function attendanceTrend(int $memberId): array
    {
        $since = now()->subDays(13)->startOfDay();

        $counts = AttendanceRecord::query()
            ->where('member_id', $memberId)
            ->where('checked_in_at', '>=', $since)
            ->get(['checked_in_at'])
            ->groupBy(fn (AttendanceRecord $record) => $record->checked_in_at->toDateString());

        return collect(range(0, 13))
            ->map(function (int $offset) use ($counts, $since) {
                $date = $since->copy()->addDays($offset)->toDateString();

                return [
                    'date' => $date,
                    'visits' => $counts->get($date)?->count() ?? 0,
                ];
            })
            ->values()
            ->all();
    }

    /** @return Builder<InAppNotification> */
    private function notificationQuery(MemberPortalAccount $account): Builder
    {
        return InAppNotification::query()->where(function (Builder $query) use ($account) {
            $query->where('member_id', $account->member_id)
                ->orWhere('user_id', $account->user_id);
        });
    }
}
