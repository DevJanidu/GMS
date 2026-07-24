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

class UnavailableReportDataSource implements ReportDataSource {
    query(): Promise<ReportResult> {
        return Promise.reject(
            new Error(
                'The reporting service is awaiting final backend integration.',
            ),
        );
    }

    requestExport(): Promise<ReportExport> {
        return Promise.reject(
            new Error(
                'Exports are unavailable until the reporting service is connected.',
            ),
        );
    }

    getExport(): Promise<ReportExport> {
        return Promise.reject(
            new Error(
                'Export status is unavailable until the reporting service is connected.',
            ),
        );
    }

    printUrl(): string {
        return '#';
    }
}

/**
 * Typed integration seam owned by presentation. Worktree 3 supplies the real
 * API implementation during final integration; this fallback never fabricates
 * report or financial data.
 */
export const reportDataSource: ReportDataSource =
    new UnavailableReportDataSource();
