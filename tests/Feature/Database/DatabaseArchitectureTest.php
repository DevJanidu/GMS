<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;

uses(RefreshDatabase::class);

it('provides the complete modular database foundation', function () {
    $tables = [
        'tenants',
        'users',
        'branches',
        'roles',
        'permissions',
        'permission_role',
        'role_user',
        'user_branch',
        'gym_profiles',
        'staff_profiles',
        'members',
        'member_sequences',
        'member_documents',
        'plans',
        'plan_branch',
        'plan_price_histories',
        'member_portal_accounts',
        'membership_sequences',
        'memberships',
        'membership_status_histories',
        'membership_freezes',
        'invoice_sequences',
        'payment_sequences',
        'receipt_sequences',
        'refund_sequences',
        'invoices',
        'invoice_items',
        'payments',
        'payment_allocations',
        'installment_schedules',
        'refunds',
        'receipts',
        'payment_events',
        'member_qr_credentials',
        'attendance_settings',
        'attendance_records',
        'attendance_scan_logs',
        'attendance_corrections',
        'notification_templates',
        'notification_rules',
        'member_notification_preferences',
        'notifications',
        'announcements',
        'notification_deliveries',
        'notification_delivery_attempts',
        'report_exports',
        'audit_logs',
    ];

    foreach ($tables as $table) {
        expect(Schema::hasTable($table))->toBeTrue("Missing database table: {$table}");
    }
});

it('includes the cross-module reference and history columns', function () {
    $columns = [
        'memberships' => [
            'tenant_id', 'member_id', 'plan_id', 'branch_id', 'renewed_from_id',
            'plan_snapshot', 'access_rules_snapshot',
        ],
        'invoices' => [
            'tenant_id', 'member_id', 'membership_id', 'subtotal', 'grand_total',
            'amount_paid', 'balance_due', 'idempotency_key',
        ],
        'payments' => [
            'tenant_id', 'member_id', 'method', 'amount', 'idempotency_key',
        ],
        'attendance_records' => [
            'tenant_id', 'branch_id', 'member_id', 'membership_id', 'request_id',
            'checked_in_at', 'checked_out_at',
        ],
        'notification_deliveries' => [
            'tenant_id', 'member_id', 'channel', 'status', 'idempotency_key',
            'attempt_count',
        ],
        'audit_logs' => [
            'tenant_id', 'branch_id', 'actor_id', 'auditable_type', 'auditable_id',
            'before_values', 'after_values', 'context',
        ],
    ];

    foreach ($columns as $table => $expectedColumns) {
        expect(Schema::hasColumns($table, $expectedColumns))
            ->toBeTrue("Incomplete database table: {$table}");
    }
});
