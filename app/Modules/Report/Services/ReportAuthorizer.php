<?php

namespace App\Modules\Report\Services;

use App\Models\Branch;
use App\Models\User;
use App\Modules\Report\DTOs\ReportContext;
use Illuminate\Auth\Access\AuthorizationException;

final class ReportAuthorizer
{
    /** @var array<string, string> */
    private const PERMISSIONS = [
        'membership-summary' => 'reports.membership.view',
        'membership-sales' => 'reports.membership.view',
        'renewals' => 'reports.membership.view',
        'expiries' => 'reports.membership.view',
        'daily-attendance' => 'reports.attendance.view',
        'peak-hours' => 'reports.attendance.view',
        'member-frequency' => 'reports.attendance.view',
        'sales' => 'reports.financial.view',
        'collections' => 'reports.financial.view',
        'outstanding-balances' => 'reports.financial.view',
        'refunds' => 'reports.financial.view',
        'staff-activity' => 'reports.staff-activity.view',
        'notification-delivery' => 'reports.notification-delivery.view',
        'branch-performance' => 'reports.branch-performance.view',
    ];

    public function context(User $user, ?int $requestedBranchId = null): ReportContext
    {
        $ids = $user->hasRole('owner')
            ? Branch::query()->pluck('id')->map(fn ($id) => (int) $id)->all()
            : $user->branches()->pluck('branches.id')->map(fn ($id) => (int) $id)->all();

        if ($requestedBranchId !== null && ! in_array($requestedBranchId, $ids, true)) {
            throw new AuthorizationException('You do not have access to this branch.');
        }

        return new ReportContext(
            $user->tenant_id,
            $user->id,
            $requestedBranchId ? [$requestedBranchId] : $ids,
            $user->tenant->timezone ?? config('app.timezone'),
            $user->tenant->currency ?? 'LKR',
        );
    }

    public function authorizeReport(User $user, string $key): void
    {
        $permission = self::PERMISSIONS[$key] ?? null;
        if (! $permission || (! $user->hasRole('owner') && ! $user->hasPermission($permission))) {
            throw new AuthorizationException('You do not have permission to view this report.');
        }
    }

    public function can(User $user, string $permission): bool
    {
        return $user->hasRole('owner') || $user->hasPermission($permission);
    }

    public function permissionFor(string $key): ?string
    {
        return self::PERMISSIONS[$key] ?? null;
    }
}
