<?php

namespace App\Modules\Attendance\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Modules\AccessControl\Services\AuditLogger;
use App\Modules\Attendance\Requests\RotateQrCredentialRequest;
use App\Modules\Attendance\Services\AttendanceAuthorizer;
use App\Modules\Attendance\Services\MemberQrCredentialService;
use App\Shared\Support\ApiResponse;
use App\Tenancy\Services\BranchContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QrCredentialController extends Controller
{
    public function show(
        Request $request,
        Member $member,
        AttendanceAuthorizer $authorizer,
        MemberQrCredentialService $credentials,
    ): JsonResponse {
        $authorizer->authorize($request->user(), 'attendance.qr.manage', app(BranchContext::class)->id());

        return ApiResponse::success($credentials->cardForMember($member->id, $request->user()->id)->toArray());
    }

    public function rotate(
        RotateQrCredentialRequest $request,
        AttendanceAuthorizer $authorizer,
        MemberQrCredentialService $credentials,
        AuditLogger $audit,
    ): JsonResponse {
        $authorizer->authorize($request->user(), 'attendance.qr.manage', app(BranchContext::class)->id());
        $member = Member::query()->findOrFail($request->integer('member_id'));
        $card = $credentials->rotateForMember($member->id, $request->user()->id);
        $audit->log($request->user(), 'attendance.qr.rotated', $member, ['public_id' => $card->publicId]);

        return ApiResponse::success($card->toArray(), 'QR credential rotated.');
    }

    public function revoke(
        Request $request,
        Member $member,
        AttendanceAuthorizer $authorizer,
        MemberQrCredentialService $credentials,
        AuditLogger $audit,
    ): JsonResponse {
        $authorizer->authorize($request->user(), 'attendance.qr.manage', app(BranchContext::class)->id());
        $credentials->revokeForMember($member->id);
        $audit->log($request->user(), 'attendance.qr.revoked', $member);

        return ApiResponse::success(null, 'QR credential revoked.');
    }
}
