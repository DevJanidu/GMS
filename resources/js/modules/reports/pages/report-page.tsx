import { Head, Link } from '@inertiajs/react';
import { Download, Printer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ErrorState } from '@/components/shared/error-state';
import { PageHeader } from '@/components/shared/page-header';
import { PageLoading } from '@/components/shared/page-loading';
import { ProtectedRoute } from '@/components/shared/protected-route';
import { Button } from '@/components/ui/button';
import { ExportStatusCard } from '../components/export-status-card';
import { ReportFilterPanel } from '../components/report-filter-panel';
import { ReportResultView } from '../components/report-result-view';
import { reportDataSource } from '../contracts/report-data-source';
import { useReport } from '../hooks/use-report';
import { reportDefinitions } from '../report-definitions';
import { reportKeys } from '../types';
import type {
    ReportExport,
    ReportFilters,
    ReportKey,
} from '../types';

function initialFilters(): ReportFilters {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 30);

    return {
        date_from: from.toISOString().slice(0, 10),
        date_to: to.toISOString().slice(0, 10),
        branch_id: null,
        plan_id: null,
        member_status: null,
        payment_method: null,
        page: 1,
        per_page: 20,
    };
}

export default function ReportPage({ reportKey }: { reportKey: string }) {
    const validKey = reportKeys.includes(reportKey as ReportKey)
        ? (reportKey as ReportKey)
        : null;
    const definition = reportDefinitions.find(
        (item) => item.key === validKey,
    );

    if (!validKey || !definition) {
        return (
            <main className="p-6">
                <ErrorState
                    title="Report not found"
                    description="The requested report is not in the report catalogue."
                />
            </main>
        );
    }

    return (
        <ProtectedRoute permission={definition.permission}>
            <ReportContent reportKey={validKey} />
        </ProtectedRoute>
    );
}

function ReportContent({ reportKey }: { reportKey: ReportKey }) {
    const definition = reportDefinitions.find(
        (item) => item.key === reportKey,
    )!;
    const [filters, setFilters] = useState<ReportFilters>(initialFilters);
    const [reportExport, setReportExport] = useState<ReportExport | null>(null);
    const [exporting, setExporting] = useState(false);
    const report = useReport(reportKey, filters);

    useEffect(() => {
        if (
            !reportExport ||
            !['queued', 'processing'].includes(reportExport.status)
        ) {
            return;
        }

        const timer = window.setTimeout(() => {
            reportDataSource
                .getExport(reportExport.id)
                .then((updated) => {
                    setReportExport(updated);

                    if (updated.status === 'completed') {
                        toast.success('Your export is ready to download.', {
                            description: updated.file_name ?? undefined,
                        });
                    } else if (updated.status === 'failed') {
                        toast.error(
                            updated.failure_message ?? 'The export failed.',
                        );
                    }
                })
                .catch((reason: unknown) =>
                    toast.error(
                        reason instanceof Error
                            ? reason.message
                            : 'Unable to refresh export status.',
                    ),
                );
        }, 2500);

        return () => window.clearTimeout(timer);
    }, [reportExport]);

    function requestExport() {
        setExporting(true);
        reportDataSource
            .requestExport(reportKey, filters)
            .then(setReportExport)
            .catch((reason: unknown) =>
                toast.error(
                    reason instanceof Error
                        ? reason.message
                        : 'Unable to request the export.',
                ),
            )
            .finally(() => setExporting(false));
    }

    return (
        <>
            <Head title={definition.title} />
            <main className="mx-auto flex w-full max-w-[1500px] flex-col gap-6 p-4 print:max-w-none print:p-0 sm:p-6">
                <div className="print:hidden">
                    <Link
                        href="/reports"
                        className="text-sm text-muted-foreground hover:text-foreground"
                    >
                        ← Report catalogue
                    </Link>
                </div>
                <PageHeader
                    title={definition.title}
                    description={definition.description}
                    actions={
                        <div className="flex gap-2 print:hidden">
                            <Button
                                variant="outline"
                                onClick={() => window.print()}
                                disabled={!report.result}
                            >
                                <Printer />
                                Print
                            </Button>
                            <Button
                                onClick={requestExport}
                                disabled={exporting}
                            >
                                <Download />
                                {exporting ? 'Requesting…' : 'Export CSV'}
                            </Button>
                        </div>
                    }
                />
                <ReportFilterPanel
                    definition={definition}
                    filters={filters}
                    onChange={setFilters}
                />
                {reportExport && (
                    <ExportStatusCard reportExport={reportExport} />
                )}
                {report.loading && !report.result ? (
                    <PageLoading />
                ) : report.error && !report.result ? (
                    <ErrorState description={report.error} />
                ) : report.result ? (
                    <ReportResultView
                        result={report.result}
                        onPageChange={(page) =>
                            setFilters((current) => ({ ...current, page }))
                        }
                    />
                ) : null}
            </main>
        </>
    );
}
