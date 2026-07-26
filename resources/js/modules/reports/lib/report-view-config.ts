import type { ReportKey } from '../types';

export type ColumnFormat = 'date' | 'datetime' | 'hour' | 'money' | 'number';

export type ColumnSpec = {
    key: string;
    label: string;
    align?: 'left' | 'right';
    format?: ColumnFormat;
};

export type ChartSpec = {
    label_key: string;
    value_key: string;
    value_label: string;
};

export const REPORT_COLUMNS: Record<ReportKey, ColumnSpec[]> = {
    'membership-summary': [
        { key: 'status', label: 'Status' },
        { key: 'total', label: 'Total', align: 'right', format: 'number' },
    ],
    'membership-sales': [
        { key: 'member_number', label: 'Member #' },
        { key: 'member_name', label: 'Member' },
        { key: 'branch', label: 'Branch' },
        { key: 'plan', label: 'Plan' },
        { key: 'status', label: 'Status' },
        { key: 'sold_at', label: 'Sold on', format: 'date' },
        { key: 'expires_on', label: 'Expires on', format: 'date' },
    ],
    renewals: [
        { key: 'member_number', label: 'Member #' },
        { key: 'member_name', label: 'Member' },
        { key: 'branch', label: 'Branch' },
        { key: 'plan', label: 'Plan' },
        { key: 'status', label: 'Status' },
        { key: 'sold_at', label: 'Renewed on', format: 'date' },
        { key: 'expires_on', label: 'Expires on', format: 'date' },
    ],
    expiries: [
        { key: 'member_number', label: 'Member #' },
        { key: 'member_name', label: 'Member' },
        { key: 'branch', label: 'Branch' },
        { key: 'plan', label: 'Plan' },
        { key: 'status', label: 'Status' },
        { key: 'expires_on', label: 'Expires on', format: 'date' },
    ],
    'daily-attendance': [
        { key: 'date', label: 'Date', format: 'date' },
        {
            key: 'check_ins',
            label: 'Check-ins',
            align: 'right',
            format: 'number',
        },
        {
            key: 'still_present',
            label: 'Still present',
            align: 'right',
            format: 'number',
        },
    ],
    'peak-hours': [
        { key: 'hour', label: 'Hour', format: 'hour' },
        { key: 'visits', label: 'Visits', align: 'right', format: 'number' },
    ],
    'member-frequency': [
        { key: 'member_number', label: 'Member #' },
        { key: 'member_name', label: 'Member' },
        { key: 'visits', label: 'Visits', align: 'right', format: 'number' },
    ],
    sales: [
        { key: 'invoice_number', label: 'Invoice #' },
        { key: 'issued_on', label: 'Issued on', format: 'date' },
        { key: 'status', label: 'Status' },
        { key: 'gross_cents', label: 'Gross', align: 'right', format: 'money' },
        { key: 'paid_cents', label: 'Paid', align: 'right', format: 'money' },
        {
            key: 'refunded_cents',
            label: 'Refunded',
            align: 'right',
            format: 'money',
        },
        {
            key: 'balance_cents',
            label: 'Balance',
            align: 'right',
            format: 'money',
        },
    ],
    collections: [
        { key: 'payment_number', label: 'Payment #' },
        { key: 'paid_at', label: 'Paid at', format: 'datetime' },
        { key: 'method', label: 'Method' },
        { key: 'gross_cents', label: 'Gross', align: 'right', format: 'money' },
        {
            key: 'refunded_cents',
            label: 'Refunded',
            align: 'right',
            format: 'money',
        },
        { key: 'net_cents', label: 'Net', align: 'right', format: 'money' },
    ],
    'outstanding-balances': [
        { key: 'invoice_number', label: 'Invoice #' },
        { key: 'due_on', label: 'Due on', format: 'date' },
        {
            key: 'balance_cents',
            label: 'Balance',
            align: 'right',
            format: 'money',
        },
        { key: 'status', label: 'Status' },
    ],
    refunds: [
        { key: 'refund_number', label: 'Refund #' },
        { key: 'refunded_at', label: 'Refunded at', format: 'datetime' },
        {
            key: 'amount_cents',
            label: 'Amount',
            align: 'right',
            format: 'money',
        },
        { key: 'method', label: 'Method' },
        { key: 'reason', label: 'Reason' },
    ],
    'staff-activity': [
        { key: 'actor_id', label: 'Staff ID' },
        { key: 'action', label: 'Action' },
        { key: 'total', label: 'Count', align: 'right', format: 'number' },
    ],
    'notification-delivery': [
        { key: 'channel', label: 'Channel' },
        { key: 'status', label: 'Status' },
        { key: 'total', label: 'Count', align: 'right', format: 'number' },
    ],
    'branch-performance': [
        { key: 'branch', label: 'Branch' },
        {
            key: 'attendance',
            label: 'Attendance',
            align: 'right',
            format: 'number',
        },
        {
            key: 'membership_sales',
            label: 'Memberships sold',
            align: 'right',
            format: 'number',
        },
        {
            key: 'collections_cents',
            label: 'Collections',
            align: 'right',
            format: 'money',
        },
    ],
};

export const REPORT_CHARTS: Partial<Record<ReportKey, ChartSpec>> = {
    'membership-summary': {
        label_key: 'status',
        value_key: 'total',
        value_label: 'Memberships',
    },
    'daily-attendance': {
        label_key: 'date',
        value_key: 'check_ins',
        value_label: 'Check-ins',
    },
    'peak-hours': {
        label_key: 'hour',
        value_key: 'visits',
        value_label: 'Visits',
    },
    'member-frequency': {
        label_key: 'member_name',
        value_key: 'visits',
        value_label: 'Visits',
    },
    'staff-activity': {
        label_key: 'action',
        value_key: 'total',
        value_label: 'Actions',
    },
    'notification-delivery': {
        label_key: 'channel',
        value_key: 'total',
        value_label: 'Notifications',
    },
    'branch-performance': {
        label_key: 'branch',
        value_key: 'attendance',
        value_label: 'Attendance',
    },
};

export const KPI_LABELS: Record<string, { label: string; helper?: string }> = {
    rows: { label: 'Total records', helper: 'Matching the selected filters' },
    gross_cents: { label: 'Gross amount' },
    net_cents: { label: 'Net collected' },
    balance_cents: { label: 'Balance due' },
    refund_cents: { label: 'Refunded amount' },
    outstanding_cents: { label: 'Outstanding balance' },
};
