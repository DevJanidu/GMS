<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Modules\AccessControl\Support\PermissionCatalog;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $allSlugs = PermissionCatalog::slugs();

        $this->systemRole('owner', 'Owner', $allSlugs);

        $this->systemRole('manager', 'Manager', [
            'dashboard.view', 'dashboard.financials.view',
            'gym.view',
            'branches.view', 'branches.update',
            'staff.view', 'staff.create', 'staff.update', 'staff.suspend', 'staff.assign-branches',
            'roles.view',
            'members.view', 'members.create', 'members.update', 'members.archive',
            'plans.view', 'plans.create', 'plans.update',
            'memberships.view', 'memberships.sell', 'memberships.renew', 'memberships.freeze',
            'memberships.suspend', 'memberships.cancel', 'memberships.reactivate',
            'billing.invoices.view', 'billing.invoices.create',
            'billing.payments.view', 'billing.payments.record',
            'billing.receipts.view', 'billing.refunds.view', 'billing.refunds.create',
            'billing.outstanding.view', 'billing.collections.view',
            'attendance.scan', 'attendance.manual', 'attendance.live.view', 'attendance.history.view',
            'attendance.correct', 'attendance.reverse', 'attendance.override',
            'attendance.settings.view', 'attendance.settings.update', 'attendance.qr.manage',
            'notifications.templates.view', 'notifications.templates.create', 'notifications.templates.update',
            'notifications.rules.view', 'notifications.rules.create', 'notifications.rules.update',
            'notifications.logs.view', 'notifications.logs.retry',
            'notifications.announcements.view', 'notifications.announcements.create', 'notifications.announcements.update',
            'reports.view', 'reports.membership.view', 'reports.attendance.view', 'reports.financial.view',
            'reports.staff-activity.view', 'reports.notification-delivery.view', 'reports.branch-performance.view',
            'exports.create',
        ]);

        $this->systemRole('front-desk', 'Front Desk', [
            'dashboard.view',
            'branches.view',
            'staff.view',
            'members.view', 'members.create', 'members.update',
            'memberships.view', 'memberships.sell', 'memberships.renew',
            'billing.invoices.view', 'billing.invoices.create',
            'billing.payments.view', 'billing.payments.record', 'billing.receipts.view',
            'attendance.scan', 'attendance.manual', 'attendance.live.view', 'attendance.history.view',
        ]);

        // Portal-only accounts: no staff/dashboard permissions, just the
        // marker role used to identify member-portal users (see
        // MemberPortalLoginResponse for how this drives the post-login redirect).
        $this->systemRole('member', 'Member', []);
    }

    /**
     * @param  list<string>  $slugs
     */
    private function systemRole(string $slug, string $name, array $slugs): void
    {
        $role = Role::query()->updateOrCreate(
            ['tenant_id' => null, 'slug' => $slug],
            ['name' => $name, 'is_system' => true]
        );

        $permissionIds = Permission::query()->whereIn('slug', $slugs)->pluck('id');

        $role->permissions()->sync($permissionIds);
    }
}
