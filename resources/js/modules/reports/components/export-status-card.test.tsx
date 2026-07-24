import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ReportExport } from '../types';
import { ExportStatusCard } from './export-status-card';

function reportExport(
    status: ReportExport['status'],
): ReportExport {
    return {
        id: 1,
        report_key: 'sales',
        status,
        file_name: status === 'completed' ? 'sales.csv' : null,
        download_url:
            status === 'completed' ? '/api/v1/report-exports/1/download' : null,
        expires_at: null,
        failure_message: status === 'failed' ? 'Export failed safely.' : null,
    };
}

describe('ExportStatusCard', () => {
    it('shows a protected download only when completed', () => {
        const { rerender } = render(
            <ExportStatusCard reportExport={reportExport('queued')} />,
        );
        expect(screen.queryByRole('link')).not.toBeInTheDocument();

        rerender(
            <ExportStatusCard reportExport={reportExport('completed')} />,
        );
        expect(screen.getByRole('link', { name: /download/i })).toHaveAttribute(
            'href',
            '/api/v1/report-exports/1/download',
        );
    });

    it('renders a safe failure state', () => {
        render(<ExportStatusCard reportExport={reportExport('failed')} />);
        expect(screen.getByText('Export failed safely.')).toBeInTheDocument();
    });
});
