<?php

namespace App\Modules\Attendance\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Attendance\DTOs\AttendanceCommand;
use App\Modules\Attendance\Enums\AttendanceRejectionReason;
use App\Modules\Attendance\Enums\AttendanceSource;
use App\Modules\Attendance\Requests\ManualAttendanceRequest;
use App\Modules\Attendance\Services\AttendanceAuthorizer;
use App\Modules\Attendance\Services\AttendanceRecorderService;
use App\Modules\Attendance\Services\AttendanceSettingsService;
use App\Shared\Support\ApiResponse;
use App\Tenancy\Services\BranchContext;
use Illuminate\Http\JsonResponse;

class ManualAttendanceController extends Controller
{
    public function store(
        ManualAttendanceRequest $request,
        AttendanceAuthorizer $authorizer,
        AttendanceRecorderService $recorder,
        AttendanceSettingsService $settings,
    ): JsonResponse {
        $branchId = app(BranchContext::class)->id();
        $authorizer->authorize($request->user(), 'attendance.manual', $branchId);
        if (! $settings->forBranch((int) $branchId)->allow_manual_entry) {
            return ApiResponse::error('Manual attendance is disabled for this branch.', 403);
        }
        if ($request->boolean('override')) {
            $authorizer->authorize($request->user(), 'attendance.override', $branchId);
        }

        $result = $recorder->record(new AttendanceCommand(
            requestId: $request->string('request_id')->toString(),
            source: AttendanceSource::Manual,
            actorId: $request->user()->id,
            memberId: $request->integer('member_id'),
            deviceId: $request->filled('device_id') ? $request->string('device_id')->toString() : null,
            action: 'check_in',
            overrideRequested: $request->boolean('override'),
            overrideReason: $request->filled('override_reason')
                ? $request->string('override_reason')->toString()
                : null,
        ));

        if (! $result->accepted) {
            $reason = $result->reason ?? AttendanceRejectionReason::MemberNotFound;
            $status = $reason === AttendanceRejectionReason::DuplicateRequest ? 409 : 422;

            return ApiResponse::error($reason->message(), $status, ['reason_code' => [$reason->value]]);
        }

        return ApiResponse::success($result->toArray());
    }
}
