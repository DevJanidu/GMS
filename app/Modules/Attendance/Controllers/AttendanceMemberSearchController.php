<?php

namespace App\Modules\Attendance\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Modules\Attendance\Services\AttendanceAuthorizer;
use App\Shared\Support\ApiResponse;
use App\Tenancy\Services\BranchContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttendanceMemberSearchController extends Controller
{
    public function __invoke(Request $request, AttendanceAuthorizer $authorizer): JsonResponse
    {
        $authorizer->authorize($request->user(), 'attendance.manual', app(BranchContext::class)->id());
        $validated = $request->validate([
            'search' => ['required', 'string', 'min:2', 'max:100'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:25'],
        ]);
        $search = $validated['search'];

        $members = Member::query()
            ->where(function ($query) use ($search): void {
                $query->where('member_number', 'like', "%{$search}%")
                    ->orWhere('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            })
            ->orderBy('first_name')
            ->limit((int) ($validated['limit'] ?? 10))
            ->get()
            ->map(fn (Member $member): array => [
                'id' => $member->id,
                'member_number' => $member->member_number,
                'display_name' => $member->fullName(),
                'status' => $member->status->value,
            ]);

        return ApiResponse::success($members);
    }
}
