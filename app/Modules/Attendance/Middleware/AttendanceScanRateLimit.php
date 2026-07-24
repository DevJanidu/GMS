<?php

namespace App\Modules\Attendance\Middleware;

use App\Modules\Attendance\Enums\AttendanceRejectionReason;
use App\Modules\Attendance\Events\AttendanceRejected;
use App\Shared\Support\ApiResponse;
use App\Tenancy\Services\BranchContext;
use App\Tenancy\Services\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class AttendanceScanRateLimit
{
    public function handle(Request $request, Closure $next): Response
    {
        $tenantId = app(TenantContext::class)->id() ?? 0;
        $branchId = app(BranchContext::class)->id() ?? 0;
        $actorId = (int) ($request->user()?->id ?? 0);
        $device = substr((string) $request->input('device_id', ''), 0, 128);
        $key = 'attendance-scan:'.hash('sha256', implode('|', [
            $tenantId, $branchId, $actorId, $device, $request->ip(),
        ]));
        $maxAttempts = 30;
        $decaySeconds = 60;

        if (RateLimiter::tooManyAttempts($key, $maxAttempts)) {
            $reason = AttendanceRejectionReason::RateLimitExceeded;
            $suppliedRequestId = $request->input('request_id');
            AttendanceRejected::dispatch(
                eventId: is_string($suppliedRequestId) && Str::isUuid($suppliedRequestId)
                    ? $suppliedRequestId
                    : (string) Str::uuid(),
                tenantId: $tenantId,
                branchId: $branchId,
                memberId: null,
                membershipId: null,
                actorId: $actorId,
                deviceId: $device ?: null,
                source: 'phone_camera',
                result: 'rejected',
                reasonCode: $reason->value,
                occurredAt: now()->toIso8601String(),
                overrideApplied: false,
            );

            return ApiResponse::error(
                $reason->message(),
                429,
                ['reason_code' => [$reason->value]],
            )->withHeaders(['Retry-After' => RateLimiter::availableIn($key)]);
        }

        RateLimiter::hit($key, $decaySeconds);

        return $next($request);
    }
}
