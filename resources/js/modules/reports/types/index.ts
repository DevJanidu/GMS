export const reportKeys = [
    'membership-summary',
    'membership-sales',
    'renewals',
    'expiries',
    'daily-attendance',
    'peak-hours',
    'member-frequency',
    'sales',
    'collections',
    'outstanding-balances',
    'refunds',
    'staff-activity',
    'notification-delivery',
    'branch-performance',
] as const;

export type ReportKey = (typeof reportKeys)[number];

export type ReportFilterName =
    | 'date_range'
    | 'branch'
    | 'plan'
    | 'member_status'
    | 'payment_method';

export type ReportDefinition = {
    key: ReportKey;
    title: string;
    description: string;
    category: 'Membership' | 'Attendance' | 'Financial' | 'Operations';
    permission: string;
    filters: ReportFilterName[];
};

export type ReportFilters = {
    date_from: string;
    date_to: string;
    branch_id: number | null;
    plan_id: number | null;
    member_status: string | null;
    payment_method: string | null;
    page: number;
    per_page: number;
};

export type ReportResult = {
    key: ReportKey;
    title: string;
    generated_at: string;
    kpis: { key: string; label: string; value: string; helper?: string }[];
    chart: {
        label_key: string;
        value_key: string;
        value_label: string;
        items: Record<string, string | number>[];
    } | null;
    table: {
        columns: { key: string; label: string; align?: 'left' | 'right' }[];
        rows: Record<string, string | number | null>[];
    };
    meta: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
};

export type ExportStatus =
    | 'queued'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'expired';

export type ReportExport = {
    id: string | number;
    report_key: ReportKey;
    status: ExportStatus;
    file_name: string | null;
    download_url: string | null;
    expires_at: string | null;
    failure_message: string | null;
};
