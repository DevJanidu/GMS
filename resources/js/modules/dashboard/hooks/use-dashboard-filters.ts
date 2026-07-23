import { useEffect, useState } from 'react';
import { ApiRequestError } from '@/lib/api/client';
import { dashboardApi } from '../api/dashboard';
import type { DashboardFilters } from '../types';

export type UseDashboardFiltersResult = {
    filters: DashboardFilters | null;
    isLoading: boolean;
    error: string | null;
};

export function useDashboardFilters(): UseDashboardFiltersResult {
    const [filters, setFilters] = useState<DashboardFilters | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        dashboardApi
            .filters()
            .then((response) => {
                if (!cancelled) {
                    setFilters(response.data);
                }
            })
            .catch((err: unknown) => {
                if (!cancelled) {
                    setError(
                        err instanceof ApiRequestError
                            ? err.message
                            : 'Unable to load filter options.',
                    );
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setIsLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return { filters, isLoading, error };
}
