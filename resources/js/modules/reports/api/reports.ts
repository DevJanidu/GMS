import { apiClient } from '@/lib/api/client';
import type { ApiSuccess } from '@/lib/api/client';

export type ReportCatalogueItem = {
    key: string;
    label: string;
    filters: string[];
};

export type ReportResult = {
    report_key: string;
    generated_at: string;
    currency: string;
    filters: Record<string, unknown>;
    kpis: Record<string, number>;
    rows: Record<string, unknown>[];
    meta: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
};

export const reportsApi = {
    catalogue: () =>
        apiClient.get<ApiSuccess<ReportCatalogueItem[]>>('/reports/catalogue'),
    show: (key: string, query = '') =>
        apiClient.get<ApiSuccess<ReportResult>>(`/reports/${key}${query}`),
    print: (key: string, query = '') =>
        apiClient.get<ApiSuccess<ReportResult>>(
            `/reports/${key}/print${query}`,
        ),
    operational: (query = '') =>
        apiClient.get<ApiSuccess<Record<string, unknown>>>(
            `/reports/dashboard/operational${query}`,
        ),
};
