<?php

namespace App\Modules\Attendance\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\AccessControl\Services\AuditLogger;
use App\Modules\Attendance\Requests\UpdateAttendanceSettingsRequest;
use App\Modules\Attendance\Services\AttendanceAuthorizer;
use App\Modules\Attendance\Services\AttendancePresenter;
use App\Modules\Attendance\Services\AttendanceSettingsService;
use App\Shared\Support\ApiResponse;
use App\Tenancy\Services\BranchContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttendanceSettingsController extends Controller
{
    public function show(
        Request $request,
        AttendanceAuthorizer $authorizer,
        AttendanceSettingsService $settings,
        AttendancePresenter $presenter,
    ): JsonResponse {
        $branchId = (int) app(BranchContext::class)->id();
        $authorizer->authorize($request->user(), 'attendance.settings.view', $branchId);

        return ApiResponse::success($presenter->setting($settings->forBranch($branchId)));
    }

    public function update(
        UpdateAttendanceSettingsRequest $request,
        AttendanceAuthorizer $authorizer,
        AttendanceSettingsService $settings,
        AttendancePresenter $presenter,
        AuditLogger $audit,
    ): JsonResponse {
        $branchId = (int) app(BranchContext::class)->id();
        $authorizer->authorize($request->user(), 'attendance.settings.update', $branchId);
        $setting = $settings->forBranch($branchId);
        $before = $presenter->setting($setting);
        $setting->fill($request->validated())->save();
        $after = $presenter->setting($setting->refresh());
        $audit->log($request->user(), 'attendance.settings.updated', $setting, [
            'before' => $before,
            'after' => $after,
        ]);

        return ApiResponse::success($after, 'Attendance settings updated.');
    }
}
