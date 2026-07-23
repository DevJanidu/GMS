import { useCallback, useEffect, useState } from 'react';
import { ApiRequestError } from '@/lib/api/client';
import { dashboardApi } from '../api/dashboard';
import type { DashboardSummaryParams } from '../api/dashboard';
import type { DashboardSummary } from '../types';

export type UseDashboardSummaryResult = {
    summary: DashboardSummary | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
};

export function useDashboardSummary(
    params: DashboardSummaryParams,
): UseDashboardSummaryResult {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [requestToken, setRequestToken] = useState(0);

    const branchId = params.branchId ?? null;
    const dateFrom = params.dateFrom;
    const dateTo = params.dateTo;
    const requestKey = JSON.stringify([branchId, dateFrom, dateTo, requestToken]);

    // `resolvedKey` tracks which request the current summary/error state
    // reflects. Deriving `isLoading` from the mismatch (rather than setting
    // a loading flag synchronously at the top of the effect) avoids an
    // extra render pass before the fetch has even started.
    const [resolvedKey, setResolvedKey] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        dashboardApi
            .summary({ branchId, dateFrom, dateTo })
            .then((response) => {
                if (!cancelled) {
                    setSummary(response.data);
                    setError(null);
                }
            })
            .catch((err: unknown) => {
                if (!cancelled) {
                    setError(
                        err instanceof ApiRequestError
                            ? err.message
                            : 'Unable to load dashboard data. Please try again.',
                    );
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setResolvedKey(requestKey);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [branchId, dateFrom, dateTo, requestKey]);

    const refetch = useCallback(() => {
        setRequestToken((token) => token + 1);
    }, []);

    return { summary, isLoading: resolvedKey !== requestKey, error, refetch };
}
