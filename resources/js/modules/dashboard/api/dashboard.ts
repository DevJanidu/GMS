import { apiClient } from '@/lib/api/client';
import type { ApiSuccess } from '@/lib/api/client';
import type { DashboardFilters, DashboardSummary } from '../types';

export type DashboardSummaryParams = {
    branchId?: number | null;
    dateFrom?: string;
    dateTo?: string;
};

function toQueryString(params: DashboardSummaryParams): string {
    const query = new URLSearchParams();

    if (params.branchId) {
        query.set('branch_id', String(params.branchId));
    }

    if (params.dateFrom) {
        query.set('date_from', params.dateFrom);
    }

    if (params.dateTo) {
        query.set('date_to', params.dateTo);
    }

    const qs = query.toString();

    return qs ? `?${qs}` : '';
}

export const dashboardApi = {
    summary: (params: DashboardSummaryParams = {}) =>
        apiClient.get<ApiSuccess<DashboardSummary>>(
            `/dashboard/summary${toQueryString(params)}`,
        ),

    filters: () =>
        apiClient.get<ApiSuccess<DashboardFilters>>('/dashboard/filters'),
};
