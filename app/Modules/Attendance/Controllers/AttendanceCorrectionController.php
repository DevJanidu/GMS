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

class AttendanceCorrectionController extends Controller
{
    public function store(
        MutateAttendanceRecordRequest $request,
        AttendanceRecord $attendanceRecord,
        AttendanceAuthorizer $authorizer,
        AttendanceRecordMutationService $mutations,
        AttendancePresenter $presenter,
    ): JsonResponse {
        abort_unless($attendanceRecord->branch_id === app(BranchContext::class)->id(), 404);
        $authorizer->authorize($request->user(), 'attendance.correct', $attendanceRecord->branch_id);

        if (! $request->hasAny(['checked_in_at', 'checked_out_at'])) {
            return ApiResponse::error(
                'At least one attendance timestamp must be supplied.',
                422,
                ['timestamps' => ['Supply checked_in_at or checked_out_at.']],
            );
        }

        try {
            $record = $mutations->correct(
                $attendanceRecord,
                $request->string('request_id')->toString(),
                $request->safe()->only(['checked_in_at', 'checked_out_at']),
                $request->user()->id,
                $request->string('reason')->toString(),
            );
        } catch (DomainException $exception) {
            return ApiResponse::error($exception->getMessage(), str_contains($exception->getMessage(), 'idempotency') ? 409 : 422);
        }

        return ApiResponse::success($presenter->record($record), 'Attendance corrected.');
    }
}
