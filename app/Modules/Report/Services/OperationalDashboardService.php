<?php

namespace App\Modules\Report\Services;

use App\Modules\AccessControl\Models\AuditLog;
use App\Modules\Attendance\Models\AttendanceRecord;
use App\Modules\Billing\Models\Invoice;
use App\Modules\Membership\Models\Membership;
use App\Modules\Notification\Models\NotificationDelivery;
use App\Modules\Report\DTOs\ReportContext;
use Carbon\CarbonImmutable;

final class OperationalDashboardService
{
    /** @return array<string, mixed> */
    public function build(ReportContext $context, bool $financials): array
    {
        $today = CarbonImmutable::now($context->timezone)->startOfDay();
        $tomorrowUtc = $today->addDay()->utc();
        $todayUtc = $today->utc();

        return [
            'today_attendance' => AttendanceRecord::withoutGlobalScopes()
                ->where('tenant_id', $context->tenantId)->whereIn('branch_id', $context->branchIds)
                ->where('checked_in_at', '>=', $todayUtc)
                ->where('checked_in_at', '<', $tomorrowUtc)->count(),
            'present_members' => AttendanceRecord::withoutGlobalScopes()
                ->where('tenant_id', $context->tenantId)->whereIn('branch_id', $context->branchIds)
                ->where('status', 'checked_in')->whereNull('checked_out_at')->count(),
            'expiring_memberships' => Membership::withoutGlobalScopes()
                ->where('tenant_id', $context->tenantId)->whereIn('branch_id', $context->branchIds)
                ->where('status', 'active')->whereBetween('expires_on', [$today->toDateString(), $today->copy()->addDays(30)->toDateString()])->count(),
            'failed_notifications' => NotificationDelivery::withoutGlobalScopes()
                ->where('tenant_id', $context->tenantId)
                ->where(fn ($q) => $q->whereNull('branch_id')->orWhereIn('branch_id', $context->branchIds))
                ->where('status', 'failed')->count(),
            'outstanding_balance_cents' => $financials
                ? (int) Invoice::withoutGlobalScopes()->where('tenant_id', $context->tenantId)
                    ->whereIn('branch_id', $context->branchIds)->where('status', '!=', 'void')->sum('balance_due_cents')
                : null,
            'recent_activity' => AuditLog::withoutGlobalScopes()->where('tenant_id', $context->tenantId)
                ->where(fn ($q) => $q->whereNull('branch_id')->orWhereIn('branch_id', $context->branchIds))
                ->latest()->limit(10)->get(['id', 'actor_id', 'action', 'entity_identifier', 'created_at']),
            'generated_at' => now()->toIso8601String(),
        ];
    }
}
