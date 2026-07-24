<?php

namespace App\Modules\Attendance\Services;

use App\Enums\MemberStatus;
use App\Models\Member;
use App\Models\User;
use App\Modules\AccessControl\Services\AuditLogger;
use App\Modules\Attendance\Contracts\AttendanceRecorder;
use App\Modules\Attendance\DTOs\AttendanceCommand;
use App\Modules\Attendance\DTOs\AttendanceResult;
use App\Modules\Attendance\Enums\AttendanceMode;
use App\Modules\Attendance\Enums\AttendanceRejectionReason;
use App\Modules\Attendance\Enums\AttendanceStatus;
use App\Modules\Attendance\Events\AttendanceCheckedIn;
use App\Modules\Attendance\Events\AttendanceCheckedOut;
use App\Modules\Attendance\Events\AttendanceOverrideApplied;
use App\Modules\Attendance\Events\AttendanceRejected;
use App\Modules\Attendance\Models\AttendanceRecord;
use App\Modules\Attendance\Models\AttendanceScanLog;
use App\Modules\Attendance\Models\AttendanceSetting;
use App\Modules\Membership\Contracts\MembershipAccessChecker;
use App\Modules\Membership\Enums\MembershipStatus;
use App\Modules\Membership\Models\Membership;
use App\Tenancy\Services\BranchContext;
use App\Tenancy\Services\TenantContext;
use Carbon\CarbonImmutable;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class AttendanceRecorderService implements AttendanceRecorder
{
    public function __construct(
        private readonly MembershipAccessChecker $membershipAccess,
        private readonly MemberQrCredentialService $qrCredentials,
        private readonly AttendanceSettingsService $settings,
        private readonly AuditLogger $audit,
    ) {}

    public function record(AttendanceCommand $command): AttendanceResult
    {
        $tenant = app(TenantContext::class)->get();
        $branch = app(BranchContext::class)->get();
        throw_if(! $tenant || ! $branch, RuntimeException::class, 'Tenant and branch context are required.');

        $requestHash = $command->fingerprint();
        $existing = AttendanceScanLog::query()->where('request_id', $command->requestId)->first();
        if ($existing) {
            return $this->replay($existing, $requestHash);
        }

        $credential = null;
        $memberId = $command->memberId;
        if ($command->qrToken !== null) {
            $credential = $this->qrCredentials->resolveToken($command->qrToken);
            if (! $credential) {
                return $this->reject(
                    $command,
                    $requestHash,
                    AttendanceRejectionReason::InvalidQr,
                );
            }
            $memberId = $credential->member_id;
        }

        if (! $memberId) {
            return $this->reject($command, $requestHash, AttendanceRejectionReason::MemberNotFound);
        }

        try {
            return DB::transaction(function () use (
                $command,
                $requestHash,
                $credential,
                $memberId,
                $tenant,
                $branch,
            ): AttendanceResult {
                $existing = AttendanceScanLog::query()
                    ->where('request_id', $command->requestId)
                    ->lockForUpdate()
                    ->first();
                if ($existing) {
                    return $this->replay($existing, $requestHash);
                }

                $member = Member::query()->lockForUpdate()->find($memberId);
                if (! $member) {
                    return $this->reject($command, $requestHash, AttendanceRejectionReason::MemberNotFound);
                }

                // A missing-row idempotency lookup does not serialize concurrent
                // requests on every supported database. The member row does, so
                // repeat the lookup after acquiring that lock.
                $existing = AttendanceScanLog::query()
                    ->where('request_id', $command->requestId)
                    ->first();
                if ($existing) {
                    return $this->replay($existing, $requestHash);
                }

                if ($credential && $command->qrToken !== null) {
                    $credential = $this->qrCredentials->resolveToken($command->qrToken, lockForUpdate: true);
                    if (! $credential || $credential->member_id !== $member->id) {
                        return $this->reject(
                            $command,
                            $requestHash,
                            AttendanceRejectionReason::InvalidQr,
                        );
                    }
                }

                $setting = $this->settings->forBranch($branch->id);
                [$membership, $reason] = $this->assessEligibility($member, $setting, $branch->id, $tenant->timezone);

                $overrideApplied = false;
                if ($reason) {
                    if (
                        ! $command->overrideRequested
                        || ! $command->overrideReason
                        || ! $this->isOverridable($reason)
                        || ! $membership
                    ) {
                        return $this->reject($command, $requestHash, $reason, $member, $membership);
                    }
                    $overrideApplied = true;
                }

                $now = CarbonImmutable::now($tenant->timezone);
                $recent = AttendanceRecord::query()
                    ->where('branch_id', $branch->id)
                    ->where('member_id', $member->id)
                    ->where('status', '!=', AttendanceStatus::Reversed)
                    ->where('checked_in_at', '>=', $now->subSeconds($setting->duplicate_window_seconds))
                    ->latest('checked_in_at')
                    ->first();

                $open = AttendanceRecord::query()
                    ->where('branch_id', $branch->id)
                    ->where('member_id', $member->id)
                    ->where('status', AttendanceStatus::CheckedIn)
                    ->whereNull('checked_out_at')
                    ->latest('checked_in_at')
                    ->first();

                if ($setting->mode === AttendanceMode::CheckInOut && $open) {
                    if ($recent && $command->action !== 'check_out') {
                        return $this->reject(
                            $command,
                            $requestHash,
                            AttendanceRejectionReason::AlreadyCheckedIn,
                            $member,
                            $membership,
                        );
                    }

                    if (in_array($command->action, ['auto', 'check_out'], true)) {
                        return $this->checkOut($open, $member, $membership, $command, $requestHash);
                    }

                    return $this->reject(
                        $command,
                        $requestHash,
                        AttendanceRejectionReason::AlreadyCheckedIn,
                        $member,
                        $membership,
                    );
                }

                if ($recent) {
                    return $this->reject(
                        $command,
                        $requestHash,
                        AttendanceRejectionReason::AlreadyCheckedIn,
                        $member,
                        $membership,
                    );
                }

                if ($command->action === 'check_out') {
                    return $this->reject(
                        $command,
                        $requestHash,
                        AttendanceRejectionReason::MembershipNotActive,
                        $member,
                        $membership,
                    );
                }

                $record = AttendanceRecord::query()->create([
                    'tenant_id' => $tenant->id,
                    'branch_id' => $branch->id,
                    'member_id' => $member->id,
                    'membership_id' => $membership?->id,
                    'qr_credential_id' => $credential?->id,
                    'request_id' => $command->requestId,
                    'request_hash' => $requestHash,
                    'status' => AttendanceStatus::CheckedIn,
                    'open_presence_key' => $setting->mode === AttendanceMode::CheckInOut
                        ? implode(':', [$tenant->id, $branch->id, $member->id])
                        : null,
                    'source' => $command->source,
                    'checked_in_at' => $now,
                    'device_id' => $command->deviceId,
                    'recorded_by' => $command->actorId,
                    'override_by' => $overrideApplied ? $command->actorId : null,
                    'override_reason' => $overrideApplied ? $command->overrideReason : null,
                    'metadata' => ['attendance_mode' => $setting->mode->value],
                ]);

                $result = new AttendanceResult(
                    accepted: true,
                    result: 'checked_in',
                    attendanceRecordId: $record->id,
                    member: $this->safeMember($member),
                    occurredAt: $now->toIso8601String(),
                    overrideApplied: $overrideApplied,
                );

                $this->log($command, $requestHash, $result, $member, $membership, $record);

                if ($overrideApplied) {
                    $actor = User::query()->findOrFail($command->actorId);
                    $this->audit->log($actor, 'attendance.override.applied', $record, [
                        'reason_code' => $reason?->value,
                        'reason' => $command->overrideReason,
                        'request_id' => $command->requestId,
                    ]);
                }

                DB::afterCommit(function () use ($record, $command, $now, $overrideApplied, $reason): void {
                    AttendanceCheckedIn::dispatch(
                        eventId: $command->requestId,
                        tenantId: $record->tenant_id,
                        branchId: $record->branch_id,
                        attendanceRecordId: $record->id,
                        memberId: $record->member_id,
                        membershipId: $record->membership_id,
                        actorId: $command->actorId,
                        deviceId: $command->deviceId,
                        source: $command->source->value,
                        result: 'checked_in',
                        occurredAt: $now->toIso8601String(),
                        overrideApplied: $overrideApplied,
                    );

                    if ($overrideApplied) {
                        AttendanceOverrideApplied::dispatch(
                            eventId: $command->requestId,
                            tenantId: $record->tenant_id,
                            branchId: $record->branch_id,
                            attendanceRecordId: $record->id,
                            memberId: $record->member_id,
                            membershipId: $record->membership_id,
                            actorId: $command->actorId,
                            deviceId: $command->deviceId,
                            source: $command->source->value,
                            result: 'override_applied',
                            reasonCode: $reason?->value ?? 'unknown',
                            occurredAt: $now->toIso8601String(),
                            overrideApplied: true,
                        );
                    }
                });

                return $result;
            });
        } catch (UniqueConstraintViolationException $exception) {
            // The database uniqueness constraint is the final guard for two
            // requests that raced before either could observe the scan log.
            $existing = AttendanceScanLog::query()
                ->where('request_id', $command->requestId)
                ->first();

            if ($existing) {
                return $this->replay($existing, $requestHash);
            }

            throw $exception;
        }
    }

    /**
     * @return array{0:?Membership,1:?AttendanceRejectionReason}
     */
    private function assessEligibility(
        Member $member,
        AttendanceSetting $setting,
        int $branchId,
        string $timezone,
    ): array {
        if ($member->status !== MemberStatus::Active) {
            return [null, AttendanceRejectionReason::MemberInactive];
        }

        $memberships = Membership::query()
            ->with('plan.branches')
            ->where('member_id', $member->id)
            ->orderByDesc('starts_on')
            ->orderByDesc('id')
            ->get();

        if ($memberships->isEmpty()) {
            return [null, AttendanceRejectionReason::MembershipNotFound];
        }

        // starts_on/grace_ends_on are date-only columns parsed in the app's
        // default timezone (UTC), not the tenant timezone. Comparing them as
        // instants against "now" in the tenant timezone is off by the tenant's
        // UTC offset and can reject a membership that already started today
        // (e.g. Asia/Colombo is UTC+5:30, so its local midnight is still the
        // previous UTC evening). Compare calendar-date strings instead.
        $today = CarbonImmutable::now($timezone)->startOfDay();
        $todayDate = $today->toDateString();
        $membership = $memberships->first(fn (Membership $item): bool => in_array($item->status, [
            MembershipStatus::Active,
            MembershipStatus::Frozen,
            MembershipStatus::Suspended,
        ], true)
            && $item->starts_on->toDateString() <= $todayDate
        ) ?? $memberships->first();

        if ($membership->starts_on->toDateString() > $todayDate) {
            return [$membership, AttendanceRejectionReason::MembershipNotActive];
        }
        if ($membership->status === MembershipStatus::Frozen) {
            return [$membership, AttendanceRejectionReason::MembershipFrozen];
        }
        if ($membership->status === MembershipStatus::Suspended) {
            return [$membership, AttendanceRejectionReason::MembershipSuspended];
        }
        if (
            $membership->status === MembershipStatus::Expired
            || $membership->status === MembershipStatus::Cancelled
            || $membership->grace_ends_on->toDateString() < $todayDate
        ) {
            return [$membership, AttendanceRejectionReason::MembershipExpired];
        }
        if (! $this->membershipAccess->hasAccess($membership, $today)) {
            return [$membership, AttendanceRejectionReason::MembershipNotActive];
        }

        $rules = $membership->plan_access_rules_snapshot ?? [];
        if (($rules['gym_access'] ?? true) === false) {
            return [$membership, AttendanceRejectionReason::PlanAccessDenied];
        }

        if (
            isset($rules['allowed_branch_ids'])
            && is_array($rules['allowed_branch_ids'])
            && ! in_array($branchId, array_map('intval', $rules['allowed_branch_ids']), true)
        ) {
            return [$membership, AttendanceRejectionReason::BranchNotAllowed];
        }

        if ($membership->plan) {
            if (! $membership->plan->isAvailableAtBranch($branchId)) {
                return [$membership, AttendanceRejectionReason::BranchNotAllowed];
            }
        } elseif ($membership->branch_id !== $branchId) {
            return [$membership, AttendanceRejectionReason::BranchNotAllowed];
        }

        if ($this->visitLimitReached($member->id, $membership, $setting, $timezone)) {
            return [$membership, AttendanceRejectionReason::VisitLimitReached];
        }

        return [$membership, null];
    }

    private function visitLimitReached(
        int $memberId,
        Membership $membership,
        AttendanceSetting $setting,
        string $timezone,
    ): bool {
        $planRules = $membership->plan_access_rules_snapshot ?? [];
        $settingRules = $setting->visit_limit_rules ?? [];
        $now = CarbonImmutable::now($timezone);
        $periods = [
            'day' => [$now->startOfDay(), $now->endOfDay()],
            'week' => [$now->startOfWeek(), $now->endOfWeek()],
            'month' => [$now->startOfMonth(), $now->endOfMonth()],
        ];

        foreach ($periods as $period => [$from, $to]) {
            $limit = $planRules["visits_per_{$period}"]
                ?? $planRules["max_visits_per_{$period}"]
                ?? $settingRules["visits_per_{$period}"]
                ?? $settingRules["max_visits_per_{$period}"]
                ?? null;

            if ($limit === null || (int) $limit < 1) {
                continue;
            }

            $count = AttendanceRecord::query()
                ->where('member_id', $memberId)
                ->where('membership_id', $membership->id)
                ->where('status', '!=', AttendanceStatus::Reversed)
                ->whereBetween('checked_in_at', [$from, $to])
                ->count();

            if ($count >= (int) $limit) {
                return true;
            }
        }

        return false;
    }

    private function checkOut(
        AttendanceRecord $record,
        Member $member,
        ?Membership $membership,
        AttendanceCommand $command,
        string $requestHash,
    ): AttendanceResult {
        $now = CarbonImmutable::now(app(TenantContext::class)->get()?->timezone ?? 'UTC');
        $record->status = AttendanceStatus::CheckedOut;
        $record->checked_out_at = $now;
        $record->open_presence_key = null;
        $record->save();

        $result = new AttendanceResult(
            accepted: true,
            result: 'checked_out',
            attendanceRecordId: $record->id,
            member: $this->safeMember($member),
            occurredAt: $now->toIso8601String(),
        );
        $this->log($command, $requestHash, $result, $member, $membership, $record);

        DB::afterCommit(fn () => AttendanceCheckedOut::dispatch(
            eventId: $command->requestId,
            tenantId: $record->tenant_id,
            branchId: $record->branch_id,
            attendanceRecordId: $record->id,
            memberId: $record->member_id,
            membershipId: $record->membership_id,
            actorId: $command->actorId,
            deviceId: $command->deviceId,
            source: $command->source->value,
            result: 'checked_out',
            occurredAt: $now->toIso8601String(),
            overrideApplied: false,
        ));

        return $result;
    }

    private function reject(
        AttendanceCommand $command,
        string $requestHash,
        AttendanceRejectionReason $reason,
        ?Member $member = null,
        ?Membership $membership = null,
    ): AttendanceResult {
        return DB::transaction(function () use ($command, $requestHash, $reason, $member, $membership): AttendanceResult {
            $tenantId = app(TenantContext::class)->id();
            $branchId = app(BranchContext::class)->id();
            throw_if(! $tenantId || ! $branchId, RuntimeException::class, 'Tenant and branch context are required.');

            $existing = AttendanceScanLog::query()->where('request_id', $command->requestId)->first();
            if ($existing) {
                return $this->replay($existing, $requestHash);
            }

            $now = CarbonImmutable::now(app(TenantContext::class)->get()?->timezone ?? 'UTC');
            $result = new AttendanceResult(
                accepted: false,
                result: 'rejected',
                member: $member ? $this->safeMember($member) : null,
                occurredAt: $now->toIso8601String(),
                reason: $reason,
            );
            $this->log($command, $requestHash, $result, $member, $membership);

            DB::afterCommit(fn () => AttendanceRejected::dispatch(
                eventId: $command->requestId,
                tenantId: $tenantId,
                branchId: $branchId,
                memberId: $member?->id,
                membershipId: $membership?->id,
                actorId: $command->actorId,
                deviceId: $command->deviceId,
                source: $command->source->value,
                result: 'rejected',
                reasonCode: $reason->value,
                occurredAt: $now->toIso8601String(),
                overrideApplied: false,
            ));

            return $result;
        });
    }

    private function log(
        AttendanceCommand $command,
        string $requestHash,
        AttendanceResult $result,
        ?Member $member = null,
        ?Membership $membership = null,
        ?AttendanceRecord $record = null,
    ): void {
        AttendanceScanLog::query()->create([
            'tenant_id' => app(TenantContext::class)->id(),
            'branch_id' => app(BranchContext::class)->id(),
            'member_id' => $member?->id,
            'membership_id' => $membership?->id,
            'attendance_record_id' => $record?->id,
            'request_id' => $command->requestId,
            'request_hash' => $requestHash,
            'result' => $result->result,
            'reason_code' => $result->reason?->value,
            'reason' => $result->reason?->message(),
            'source' => $command->source,
            'device_id' => $command->deviceId,
            'scanned_by' => $command->actorId,
            'context' => [
                'response' => $result->toArray(),
                'override_applied' => $result->overrideApplied,
            ],
            'scanned_at' => now(),
        ]);
    }

    private function replay(AttendanceScanLog $log, string $requestHash): AttendanceResult
    {
        if (! $log->request_hash || ! hash_equals($log->request_hash, $requestHash)) {
            return new AttendanceResult(
                accepted: false,
                result: 'rejected',
                replayed: true,
                reason: AttendanceRejectionReason::DuplicateRequest,
            );
        }

        $response = $log->context['response'] ?? [];
        $reasonCode = $response['reason_code'] ?? $log->reason_code;

        return new AttendanceResult(
            accepted: in_array($log->result, ['checked_in', 'checked_out'], true),
            result: $log->result,
            attendanceRecordId: $log->attendance_record_id,
            member: $response['member'] ?? null,
            occurredAt: $response['checked_in_at']
                ?? $response['checked_out_at']
                ?? $log->scanned_at->toIso8601String(),
            replayed: true,
            overrideApplied: (bool) ($response['override_applied'] ?? false),
            reason: $reasonCode ? AttendanceRejectionReason::tryFrom($reasonCode) : null,
        );
    }

    /** @return array{id:int,member_number:string,display_name:string} */
    private function safeMember(Member $member): array
    {
        return [
            'id' => $member->id,
            'member_number' => $member->member_number,
            'display_name' => $member->fullName(),
        ];
    }

    private function isOverridable(AttendanceRejectionReason $reason): bool
    {
        return in_array($reason, [
            AttendanceRejectionReason::MembershipExpired,
            AttendanceRejectionReason::MembershipFrozen,
            AttendanceRejectionReason::MembershipSuspended,
            AttendanceRejectionReason::BranchNotAllowed,
            AttendanceRejectionReason::PlanAccessDenied,
            AttendanceRejectionReason::VisitLimitReached,
        ], true);
    }
}
