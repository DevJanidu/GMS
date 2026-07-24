<?php

namespace App\Modules\Attendance\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Attendance\DTOs\AttendanceCommand;
use App\Modules\Attendance\Enums\AttendanceRejectionReason;
use App\Modules\Attendance\Enums\AttendanceSource;
use App\Modules\Attendance\Models\AttendanceScanLog;
use App\Modules\Attendance\Requests\ScanAttendanceRequest;
use App\Modules\Attendance\Services\AttendanceAuthorizer;
use App\Modules\Attendance\Services\AttendancePresenter;
use App\Modules\Attendance\Services\AttendanceRecorderService;
use App\Shared\Support\ApiResponse;
use App\Tenancy\Services\BranchContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttendanceScanController extends Controller
{
    public function store(
        ScanAttendanceRequest $request,
        AttendanceAuthorizer $authorizer,
        AttendanceRecorderService $recorder,
    ): JsonResponse {
        $authorizer->authorize($request->user(), 'attendance.scan', app(BranchContext::class)->id());
        if ($request->boolean('override')) {
            $authorizer->authorize($request->user(), 'attendance.override', app(BranchContext::class)->id());
        }

        $result = $recorder->record(new AttendanceCommand(
            requestId: $request->string('request_id')->toString(),
            source: AttendanceSource::PhoneCamera,
            actorId: $request->user()->id,
            qrToken: $request->string('qr_token')->toString(),
            deviceId: $request->filled('device_id') ? $request->string('device_id')->toString() : null,
            action: $request->input('action', 'auto'),
            overrideRequested: $request->boolean('override'),
            overrideReason: $request->filled('override_reason')
                ? $request->string('override_reason')->toString()
                : null,
        ));

        if (! $result->accepted) {
            $reason = $result->reason ?? AttendanceRejectionReason::InvalidQr;
            $status = $reason === AttendanceRejectionReason::DuplicateRequest ? 409 : 422;

            return ApiResponse::error($reason->message(), $status, ['reason_code' => [$reason->value]]);
        }

        return ApiResponse::success($result->toArray(), $result->replayed ? 'Attendance request replayed.' : null);
    }

    public function recent(
        Request $request,
        AttendanceAuthorizer $authorizer,
        AttendancePresenter $presenter,
    ): JsonResponse {
        $branchId = app(BranchContext::class)->id();
        $authorizer->authorize($request->user(), 'attendance.scan', $branchId);
        $limit = min(max($request->integer('limit', 20), 1), 100);

        $logs = AttendanceScanLog::query()
            ->with('member')
            ->where('branch_id', $branchId)
            ->where('scanned_by', $request->user()->id)
            ->when($request->filled('device_id'), fn ($query) => $query->where('device_id', $request->string('device_id')->toString()))
            ->latest('scanned_at')
            ->limit($limit)
            ->get()
            ->map(fn (AttendanceScanLog $log) => $presenter->scan($log));

        return ApiResponse::success($logs);
    }
}
