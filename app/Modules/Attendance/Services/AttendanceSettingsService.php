<?php

namespace App\Modules\Attendance\Services;

use App\Modules\Attendance\Enums\AttendanceMode;
use App\Modules\Attendance\Models\AttendanceSetting;
use App\Tenancy\Services\TenantContext;
use RuntimeException;

class AttendanceSettingsService
{
    public function forBranch(int $branchId): AttendanceSetting
    {
        $tenantId = app(TenantContext::class)->id();
        throw_if(! $tenantId, RuntimeException::class, 'Tenant context is required.');

        return AttendanceSetting::query()->firstOrCreate(
            ['branch_id' => $branchId],
            [
                'tenant_id' => $tenantId,
                'mode' => AttendanceMode::CheckInOnly,
                'duplicate_window_seconds' => 60,
                'allow_manual_entry' => true,
                'manager_override_required' => true,
                'visit_limit_rules' => [],
            ],
        );
    }
}
