<?php

namespace App\Modules\Attendance\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Attendance\Enums\AttendanceMode;
use App\Modules\Attendance\Enums\AttendanceStatus;
use App\Modules\Attendance\Models\AttendanceRecord;
use App\Modules\Attendance\Services\AttendanceAuthorizer;
use App\Modules\Attendance\Services\AttendancePresenter;
use App\Modules\Attendance\Services\AttendanceSettingsService;
use App\Shared\Support\ApiResponse;
use App\Tenancy\Services\BranchContext;
use App\Tenancy\Services\TenantContext;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LiveAttendanceController extends Controller
{
    public function __invoke(
        Request $request,
        AttendanceAuthorizer $authorizer,
        AttendancePresenter $presenter,
        AttendanceSettingsService $settings,
    ): JsonResponse {
        $branchId = (int) app(BranchContext::class)->id();
        $authorizer->authorize($request->user(), 'attendance.live.view', $branchId);
        $setting = $settings->forBranch($branchId);

        $presenceQuery = AttendanceRecord::query()
            ->where('branch_id', $branchId)
            ->where('status', AttendanceStatus::CheckedIn);

        if ($setting->mode === AttendanceMode::CheckInOnly) {
            $timezone = app(TenantContext::class)->get()?->timezone ?? 'UTC';
            $today = CarbonImmutable::now($timezone);
            $presenceQuery->whereBetween('checked_in_at', [$today->startOfDay(), $today->endOfDay()]);
        } else {
            $presenceQuery->whereNull('checked_out_at');
        }

        $count = (clone $presenceQuery)->distinct()->count('member_id');
        $latestRecordIds = (clone $presenceQuery)
            ->selectRaw('MAX(id)')
            ->groupBy('member_id');
        $records = AttendanceRecord::query()
            ->with(['member', 'branch'])
            ->whereIn('id', $latestRecordIds)
            ->latest('checked_in_at')
            ->limit(100)
            ->get();

        return ApiResponse::success([
            'count' => $count,
            'mode' => $setting->mode->value,
            'records' => $records->map(fn (AttendanceRecord $record) => $presenter->record($record)),
            'truncated' => $count > $records->count(),
            'as_of' => now()->toIso8601String(),
        ]);
    }
}
