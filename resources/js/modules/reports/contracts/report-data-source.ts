import { reportsApi } from '../api/reports';
import type { BackendReportExport } from '../api/reports';
import { adaptReportResult } from '../lib/adapt-report-result';
import { reportDefinitions } from '../report-definitions';
import type {
    ReportExport,
    ReportFilters,
    ReportKey,
    ReportResult,
} from '../types';

export interface ReportDataSource {
    query(key: ReportKey, filters: ReportFilters): Promise<ReportResult>;
    requestExport(
        key: ReportKey,
        filters: ReportFilters,
    ): Promise<ReportExport>;
    getExport(id: ReportExport['id']): Promise<ReportExport>;
    printUrl(key: ReportKey, filters: ReportFilters): string;
}

function buildQuery(filters: ReportFilters): string {
    const params = new URLSearchParams();

    if (filters.date_from) {
        params.set('date_from', filters.date_from);
    }

    if (filters.date_to) {
        params.set('date_to', filters.date_to);
    }

    if (filters.branch_id) {
        params.set('branch_id', String(filters.branch_id));
    }

    if (filters.plan_id) {
        params.set('plan_id', String(filters.plan_id));
    }

    if (filters.member_status) {
        params.set('member_status', filters.member_status);
    }

    if (filters.payment_method) {
        params.set('payment_method', filters.payment_method);
    }

    params.set('page', String(filters.page));
    params.set('per_page', String(filters.per_page));

    const query = params.toString();

    return query ? `?${query}` : '';
}

function adaptExport(raw: BackendReportExport): ReportExport {
    return {
        id: raw.id,
        report_key: raw.report_key as ReportKey,
        status: raw.status,
        file_name: raw.file_name,
        download_url: raw.download_url,
        expires_at: raw.expires_at,
        failure_message: raw.failure_reason,
    };
}

class ApiReportDataSource implements ReportDataSource {
    async query(key: ReportKey, filters: ReportFilters): Promise<ReportResult> {
        const definition = reportDefinitions.find((item) => item.key === key);
        const response = await reportsApi.show(key, buildQuery(filters));

        return adaptReportResult(key, definition?.title ?? key, response.data);
    }

    async requestExport(
        key: ReportKey,
        filters: ReportFilters,
    ): Promise<ReportExport> {
        const response = await reportsApi.createExport({
            report_key: key,
            format: 'csv',
            date_from: filters.date_from,
            date_to: filters.date_to,
            branch_id: filters.branch_id,
            plan_id: filters.plan_id,
            member_status: filters.member_status,
            payment_method: filters.payment_method,
        });

        return adaptExport(response.data);
    }

    async getExport(id: ReportExport['id']): Promise<ReportExport> {
        const response = await reportsApi.getExport(id);

        return adaptExport(response.data);
    }

    printUrl(key: ReportKey, filters: ReportFilters): string {
        return `/api/v1/reports/${key}/print${buildQuery(filters)}`;
    }
}

export const reportDataSource: ReportDataSource = new ApiReportDataSource();
