import { CheckCircle2, CircleAlert, Clock3, Download } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { ReportExport } from '../types';

export function ExportStatusCard({
    reportExport,
}: {
    reportExport: ReportExport;
}) {
    const ready =
        reportExport.status === 'completed' && reportExport.download_url;

    return (
        <Alert
            variant={reportExport.status === 'failed' ? 'destructive' : 'default'}
            className="print:hidden"
        >
            {ready ? (
                <CheckCircle2 />
            ) : reportExport.status === 'failed' ? (
                <CircleAlert />
            ) : (
                <Clock3 />
            )}
            <AlertTitle className="capitalize">
                Export {reportExport.status}
            </AlertTitle>
            <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
                <span>
                    {reportExport.failure_message ??
                        (ready
                            ? 'Your export is ready to download.'
                            : 'Large exports continue in the background.')}
                </span>
                {ready && (
                    <Button size="sm" asChild>
                        <a href={reportExport.download_url ?? undefined}>
                            <Download />
                            Download
                        </a>
                    </Button>
                )}
            </AlertDescription>
        </Alert>
    );
}
