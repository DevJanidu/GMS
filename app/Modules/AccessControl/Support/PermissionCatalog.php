<?php

namespace App\Modules\AccessControl\Support;

/**
 * The full catalog of permission slugs the application understands,
 * grouped for the permission-matrix UI and for seeding.
 */
class PermissionCatalog
{
    /**
     * @return array<string, array<string, string>>
     */
    public static function all(): array
    {
        return [
            'Dashboard' => [
                'dashboard.view' => 'View the dashboard',
                'dashboard.financials.view' => 'View dashboard revenue and outstanding-balance figures',
            ],
            'Gym' => [
                'gym.view' => 'View gym settings',
                'gym.update' => 'Update gym settings',
            ],
            'Branches' => [
                'branches.view' => 'View branches',
                'branches.create' => 'Create branches',
                'branches.update' => 'Update branches',
                'branches.delete' => 'Delete branches',
            ],
            'Staff' => [
                'staff.view' => 'View staff',
                'staff.create' => 'Invite staff',
                'staff.update' => 'Update staff',
                'staff.delete' => 'Remove staff',
                'staff.suspend' => 'Suspend or activate staff',
                'staff.assign-branches' => 'Assign staff to branches',
            ],
            'Roles' => [
                'roles.view' => 'View roles',
                'roles.create' => 'Create roles',
                'roles.update' => 'Update roles',
                'roles.delete' => 'Delete roles',
            ],
            'Members' => [
                'members.view' => 'View members',
                'members.create' => 'Create members',
                'members.update' => 'Update members',
                'members.archive' => 'Archive members',
            ],
            'Plans' => [
                'plans.view' => 'View plans',
                'plans.create' => 'Create plans',
                'plans.update' => 'Update plans',
                'plans.delete' => 'Delete plans',
            ],
            'Memberships' => [
                'memberships.view' => 'View memberships',
                'memberships.sell' => 'Sell memberships',
                'memberships.renew' => 'Renew memberships',
                'memberships.freeze' => 'Freeze or resume memberships',
                'memberships.suspend' => 'Suspend memberships',
                'memberships.cancel' => 'Cancel memberships',
                'memberships.reactivate' => 'Reactivate memberships',
            ],
            'Billing' => [
                'billing.invoices.view' => 'View invoices',
                'billing.invoices.create' => 'Create invoices',
                'billing.invoices.void' => 'Void invoices',
                'billing.payments.view' => 'View payment history',
                'billing.payments.record' => 'Record payments',
                'billing.receipts.view' => 'View and print receipts',
                'billing.refunds.view' => 'View refunds',
                'billing.refunds.create' => 'Process refunds',
                'billing.outstanding.view' => 'View outstanding balances',
                'billing.collections.view' => 'View collection summaries',
            ],
            'Attendance' => [
                'attendance.scan' => 'Scan member QR check-ins',
                'attendance.manual' => 'Record manual check-ins',
                'attendance.live.view' => 'View live attendance',
                'attendance.history.view' => 'View attendance history',
                'attendance.correct' => 'Correct attendance records',
                'attendance.reverse' => 'Reverse attendance records',
                'attendance.override' => 'Override attendance eligibility checks',
                'attendance.settings.view' => 'View attendance settings',
                'attendance.settings.update' => 'Update attendance settings',
                'attendance.qr.manage' => 'Issue, rotate and revoke member QR credentials',
            ],
            'Notifications' => [
                'notifications.templates.view' => 'View notification templates',
                'notifications.templates.create' => 'Create notification templates',
                'notifications.templates.update' => 'Update notification templates',
                'notifications.templates.delete' => 'Delete notification templates',
                'notifications.rules.view' => 'View notification rules',
                'notifications.rules.create' => 'Create notification rules',
                'notifications.rules.update' => 'Update notification rules',
                'notifications.rules.delete' => 'Delete notification rules',
                'notifications.logs.view' => 'View notification delivery logs',
                'notifications.logs.retry' => 'Retry failed notification deliveries',
                'notifications.announcements.view' => 'View manual announcements',
                'notifications.announcements.create' => 'Create manual announcements',
                'notifications.announcements.update' => 'Update manual announcements',
                'notifications.announcements.dispatch' => 'Schedule/dispatch manual announcements',
                'notifications.announcements.cancel' => 'Cancel manual announcements',
            ],
            'Reports' => [
                'reports.view' => 'View the report catalogue',
                'reports.membership.view' => 'View membership reports',
                'reports.attendance.view' => 'View attendance reports',
                'reports.financial.view' => 'View financial reports',
                'reports.staff-activity.view' => 'View staff activity reports',
                'reports.notification-delivery.view' => 'View notification delivery reports',
                'reports.branch-performance.view' => 'View branch performance reports',
            ],
            'Exports' => [
                'exports.create' => 'Create report/audit exports',
                'exports.view-all' => 'View all exports (not just your own)',
                'exports.download-all' => 'Download all exports (not just your own)',
                'exports.manage' => 'Retry or manage any export',
            ],
            'Audit' => [
                'audit.view' => 'View audit logs',
                'audit.export' => 'Export audit logs',
            ],
        ];
    }

    /**
     * @return list<string>
     */
    public static function slugs(): array
    {
        return array_merge(...array_map(
            fn (array $permissions) => array_keys($permissions),
            array_values(static::all()),
        ));
    }
}
