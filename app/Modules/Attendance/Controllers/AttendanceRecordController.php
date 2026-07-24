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
use Illuminate\Http\Request;

class AttendanceRecordController extends Controller
{
    public function index(
        Request $request,
        AttendanceAuthorizer $authorizer,
        AttendancePresenter $presenter,
    ): JsonResponse {
        $branchId = (int) app(BranchContext::class)->id();
        $authorizer->authorize($request->user(), 'attendance.history.view', $branchId);
        $validated = $request->validate([
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
            'member_id' => ['nullable', 'integer', 'min:1'],
            'status' => ['nullable', 'in:checked_in,checked_out,reversed'],
            'source' => ['nullable', 'in:phone_camera,manual'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $records = AttendanceRecord::query()
            ->with(['member', 'branch', 'recordedBy', 'overriddenBy', 'corrections.correctedBy'])
            ->where('branch_id', $branchId)
            ->when($validated['date_from'] ?? null, fn ($query, $date) => $query->whereDate('checked_in_at', '>=', $date))
            ->when($validated['date_to'] ?? null, fn ($query, $date) => $query->whereDate('checked_in_at', '<=', $date))
            ->when($validated['member_id'] ?? null, fn ($query, $memberId) => $query->where('member_id', $memberId))
            ->when($validated['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($validated['source'] ?? null, fn ($query, $source) => $query->where('source', $source))
            ->latest('checked_in_at')
            ->paginate((int) ($validated['per_page'] ?? 20));

        $records->setCollection($records->getCollection()->map(
            fn (AttendanceRecord $record) => $presenter->record($record),
        ));

        return ApiResponse::paginated($records);
    }

    public function show(
        Request $request,
        AttendanceRecord $attendanceRecord,
        AttendanceAuthorizer $authorizer,
        AttendancePresenter $presenter,
    ): JsonResponse {
        abort_unless($attendanceRecord->branch_id === app(BranchContext::class)->id(), 404);
        $authorizer->authorize($request->user(), 'attendance.history.view', $attendanceRecord->branch_id);

        return ApiResponse::success($presenter->record($attendanceRecord));
    }

    public function checkout(
        MutateAttendanceRecordRequest $request,
        AttendanceRecord $attendanceRecord,
        AttendanceAuthorizer $authorizer,
        AttendanceRecordMutationService $mutations,
        AttendancePresenter $presenter,
    ): JsonResponse {
        abort_unless($attendanceRecord->branch_id === app(BranchContext::class)->id(), 404);
        $authorizer->authorize($request->user(), 'attendance.scan', $attendanceRecord->branch_id);

        try {
            $record = $mutations->checkout(
                $attendanceRecord,
                $request->string('request_id')->toString(),
                $request->user()->id,
                $request->string('reason')->toString(),
            );
        } catch (DomainException $exception) {
            return ApiResponse::error($exception->getMessage(), str_contains($exception->getMessage(), 'idempotency') ? 409 : 422);
        }

        return ApiResponse::success($presenter->record($record), 'Member checked out.');
    }
}
