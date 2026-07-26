/**
 * Mirrors the section-status discriminant returned by
 * DashboardMetricsService on the backend:
 *  - `available` — real data, safe to render.
 *  - `restricted` — the user lacks the permission for this section.
 *  - `pending_integration` — the data source (Membership/Billing module)
 *    hasn't published its contract yet; see INTEGRATION_NOTES.md.
 */
export type DashboardSectionStatus = 'available' | 'restricted' | 'pending_integration';

export type DashboardSection<T> =
    | { status: 'available'; data: T }
    | { status: 'restricted'; message: string }
    | { status: 'pending_integration'; message: string };

export type DashboardMeta = {
    dateFrom: string;
    dateTo: string;
    branchId: number | null;
    currency: string;
    generatedAt: string;
};

export type BranchComparisonItem = {
    branchId: number;
    branchName: string;
    activeMembers: number;
    revenue: number | null;
};

export type RecentActivityItem = {
    type: string;
    title: string;
    detail: string;
    occurredAt: string | null;
};

export type DashboardSummary = {
    meta: DashboardMeta;
    members: {
        active: DashboardSection<{ count: number }>;
        new: DashboardSection<{ count: number }>;
        expiring: DashboardSection<{ count: number }>;
        expired: DashboardSection<{ count: number }>;
    };
    financials: {
        revenue: DashboardSection<{ amount: number }>;
        outstanding: DashboardSection<{ amount: number }>;
    };
    recentPayments: DashboardSection<{
        items: {
            id: string;
            member: string;
            plan: string;
            amount: number;
            status: string;
        }[];
    }>;
    renewalSummary: DashboardSection<{
        renewed: number;
        dueSoon: number;
        overdue: number;
    }>;
    branchComparison: DashboardSection<BranchComparisonItem[]>;
    recentActivity: DashboardSection<RecentActivityItem[]>;
};

export type DashboardBranchOption = {
    id: number;
    name: string;
};

export type DashboardFilters = {
    branches: DashboardBranchOption[];
    defaultRange: {
        dateFrom: string;
        dateTo: string;
    };
};

export type Phase3OperationalSnapshot = {
    todayAttendance: number;
    presentMembers: number;
    failedNotifications: number;
    peakPeriods: {
        label: string;
        attendanceCount: number;
    }[];
};
