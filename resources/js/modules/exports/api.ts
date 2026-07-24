import { apiClient } from '@/lib/api/client';
import type { ApiSuccess } from '@/lib/api/client';

export type ReportExport = {
    id: string;
    report_key: string;
    format: 'csv';
    status: 'queued' | 'processing' | 'completed' | 'failed' | 'expired';
    row_count: number | null;
    expires_at: string | null;
    failure_reason: string | null;
    created_at: string;
};

export type ExportPage = ApiSuccess<ReportExport[]> & {
    meta: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
};

export const exportsApi = {
    list: () => apiClient.get<ExportPage>('/report-exports?per_page=100'),
    create: (input: Record<string, unknown>) =>
        apiClient.post<ApiSuccess<ReportExport>>('/report-exports', input),
    retry: (id: string) =>
        apiClient.post<ApiSuccess<ReportExport>>(`/report-exports/${id}/retry`),
    downloadUrl: (id: string) =>
        `/api/v1/report-exports/${encodeURIComponent(id)}/download`,
};
