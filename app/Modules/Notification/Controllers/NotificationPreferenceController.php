<?php

namespace App\Modules\Notification\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\MemberPortal\Models\MemberPortalAccount;
use App\Modules\Notification\Models\MemberNotificationPreference;
use App\Shared\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class NotificationPreferenceController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $memberId = $this->memberId($request);

        return ApiResponse::success(MemberNotificationPreference::query()
            ->where('member_id', $memberId)->orderBy('channel')->get());
    }

    public function update(Request $request): JsonResponse
    {
        $memberId = $this->memberId($request);
        $data = $request->validate([
            'preferences' => ['required', 'array', 'max:40'],
            'preferences.*.channel' => ['required', Rule::in(['in_app', 'email', 'sms', 'whatsapp'])],
            'preferences.*.notification_type' => ['required', 'string', 'max:80'],
            'preferences.*.enabled' => ['required', 'boolean'],
        ]);

        foreach ($data['preferences'] as $preference) {
            MemberNotificationPreference::query()->updateOrCreate(
                ['member_id' => $memberId, 'channel' => $preference['channel'], 'notification_type' => $preference['notification_type']],
                ['enabled' => $preference['enabled']],
            );
        }

        return $this->show($request);
    }

    private function memberId(Request $request): int
    {
        $account = MemberPortalAccount::query()
            ->where('user_id', $request->user()->id)
            ->where('status', 'active')->first();
        abort_unless($account !== null, 403, 'An active member portal account is required.');

        return $account->member_id;
    }
}
