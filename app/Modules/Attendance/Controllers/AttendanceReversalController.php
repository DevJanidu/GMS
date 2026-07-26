<?php

namespace App\Modules\Attendance\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Attendance\Models\AttendanceRecord;
use App\Modules\Attendance\Requests\MutateAttendanceRecordRequest;
use App\Modules\Attendance\Services\AttendanceAuthorizer;
use App\Modules\Attendance\Services\AttendancePresenter;
use App\Modules\Attendance\Services\AttendanceRecordMutationService;
use App\Shared\Support\ApiResponse;
use App\Tenancy\Services\BranchContext;
use DomainException;
use Illuminate\Http\JsonResponse;

class AttendanceReversalController extends Controller
{
    public function store(
        MutateAttendanceRecordRequest $request,
        AttendanceRecord $attendanceRecord,
        AttendanceAuthorizer $authorizer,
        AttendanceRecordMutationService $mutations,
        AttendancePresenter $presenter,
    ): JsonResponse {
        abort_unless($attendanceRecord->branch_id === app(BranchContext::class)->id(), 404);
        $authorizer->authorize($request->user(), 'attendance.reverse', $attendanceRecord->branch_id);

        try {
            $record = $mutations->reverse(
                $attendanceRecord,
                $request->string('request_id')->toString(),
                $request->user()->id,
                $request->string('reason')->toString(),
            );
        } catch (DomainException $exception) {
            return ApiResponse::error($exception->getMessage(), str_contains($exception->getMessage(), 'idempotency') ? 409 : 422);
        }

        return ApiResponse::success($presenter->record($record), 'Attendance reversed.');
    }
}
