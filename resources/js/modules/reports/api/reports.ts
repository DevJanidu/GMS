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

export type BackendReportExport = {
    id: string | number;
    report_key: string;
    status: 'queued' | 'processing' | 'completed' | 'failed' | 'expired';
    file_name: string | null;
    download_url: string | null;
    expires_at: string | null;
    failure_reason: string | null;
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
    createExport: (payload: Record<string, unknown>) =>
        apiClient.post<ApiSuccess<BackendReportExport>>(
            '/report-exports',
            payload,
        ),
    getExport: (id: string | number) =>
        apiClient.get<ApiSuccess<BackendReportExport>>(`/report-exports/${id}`),
};
