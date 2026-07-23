import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { DashboardSummary } from '../types';

const summaryMock = vi.fn();

beforeEach(() => {
    summaryMock.mockReset();
});

vi.mock('../api/dashboard', () => ({
    dashboardApi: {
        summary: (...args: unknown[]) => summaryMock(...args),
    },
}));

const { useDashboardSummary } = await import('./use-dashboard-summary');

function fakeSummary(activeCount: number): DashboardSummary {
    return {
        meta: {
            dateFrom: '2026-06-23',
            dateTo: '2026-07-23',
            branchId: null,
            currency: 'USD',
            generatedAt: '2026-07-23T00:00:00Z',
        },
        members: {
            active: { status: 'available', data: { count: activeCount } },
            new: { status: 'available', data: { count: 1 } },
            expiring: { status: 'pending_integration', message: 'pending' },
            expired: { status: 'pending_integration', message: 'pending' },
        },
        financials: {
            revenue: { status: 'pending_integration', message: 'pending' },
            outstanding: { status: 'pending_integration', message: 'pending' },
        },
        recentPayments: { status: 'pending_integration', message: 'pending' },
        renewalSummary: { status: 'pending_integration', message: 'pending' },
        branchComparison: { status: 'available', data: [] },
        recentActivity: { status: 'available', data: [] },
    };
}

describe('useDashboardSummary', () => {
    it('starts loading and resolves with the fetched summary', async () => {
        summaryMock.mockResolvedValueOnce({ data: fakeSummary(10) });

        const { result } = renderHook(() =>
            useDashboardSummary({ branchId: null, dateFrom: 'a', dateTo: 'b' }),
        );

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.summary?.members.active.status).toBe('available');
        expect(result.current.error).toBeNull();
    });

    it('surfaces an error message and keeps previous data on refetch failure', async () => {
        summaryMock.mockResolvedValueOnce({ data: fakeSummary(5) });

        const { result } = renderHook(() =>
            useDashboardSummary({ branchId: null, dateFrom: 'a', dateTo: 'b' }),
        );

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        summaryMock.mockRejectedValueOnce(new Error('network down'));

        act(() => {
            result.current.refetch();
        });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.error).toBe(
            'Unable to load dashboard data. Please try again.',
        );
        // Previous summary is retained rather than being wiped on error.
        expect(result.current.summary?.members.active).toEqual({
            status: 'available',
            data: { count: 5 },
        });
    });

    it('refetches when the branch filter changes', async () => {
        summaryMock.mockResolvedValueOnce({ data: fakeSummary(1) });

        const { result, rerender } = renderHook(
            (props: { branchId: number | null }) =>
                useDashboardSummary({
                    branchId: props.branchId,
                    dateFrom: 'a',
                    dateTo: 'b',
                }),
            { initialProps: { branchId: null as number | null } },
        );

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        summaryMock.mockResolvedValueOnce({ data: fakeSummary(2) });
        rerender({ branchId: 5 });

        await waitFor(() =>
            expect(result.current.summary?.members.active.status === 'available' &&
                result.current.summary.members.active.data.count).toBe(2),
        );

        expect(summaryMock).toHaveBeenCalledTimes(2);
        expect(summaryMock).toHaveBeenLastCalledWith({
            branchId: 5,
            dateFrom: 'a',
            dateTo: 'b',
        });
    });
});
