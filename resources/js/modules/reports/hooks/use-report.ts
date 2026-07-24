import { useEffect, useState } from 'react';
import { reportDataSource } from '../contracts/report-data-source';
import type { ReportFilters, ReportKey, ReportResult } from '../types';

export function useReport(key: ReportKey, filters: ReportFilters) {
    const [result, setResult] = useState<ReportResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const requestKey = JSON.stringify([key, filters]);
    const [resolvedKey, setResolvedKey] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        reportDataSource
            .query(key, filters)
            .then((data) => {
                if (!cancelled) {
                    setResult(data);
                    setError(null);
                }
            })
            .catch((reason: unknown) => {
                if (!cancelled) {
                    setError(
                        reason instanceof Error
                            ? reason.message
                            : 'Unable to load this report.',
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
    }, [filters, key, requestKey]);

    return {
        result,
        error,
        loading: resolvedKey !== requestKey,
    };
}
