import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ReportResult } from '../types';
import { ReportResultView } from './report-result-view';

const result: ReportResult = {
    key: 'membership-summary',
    title: 'Membership Summary',
    generated_at: '2026-07-24T10:00:00Z',
    kpis: [{ key: 'active', label: 'Active', value: '42' }],
    chart: null,
    table: {
        columns: [{ key: 'status', label: 'Status' }],
        rows: [{ status: 'Active' }],
    },
    meta: {
        current_page: 2,
        per_page: 20,
        total: 45,
        last_page: 3,
    },
};

describe('ReportResultView', () => {
    it('renders KPIs, rows and bounded pagination', () => {
        const onPageChange = vi.fn();
        render(
            <ReportResultView
                result={result}
                onPageChange={onPageChange}
            />,
        );

        expect(screen.getByText('42')).toBeInTheDocument();
        expect(screen.getAllByText('Active')).toHaveLength(2);
        fireEvent.click(screen.getByRole('button', { name: 'Next' }));
        expect(onPageChange).toHaveBeenCalledWith(3);
    });
});
