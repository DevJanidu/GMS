import { useEffect, useState } from 'react';
import { operationalDashboardDataSource } from '../contracts/operational-data-source';
import type { OperationalDashboardParams } from '../contracts/operational-data-source';
import type { Phase3OperationalSnapshot } from '../types';

export function useOperationalDashboard(params: OperationalDashboardParams) {
    const [snapshot, setSnapshot] =
        useState<Phase3OperationalSnapshot | null>(null);
    const [error, setError] = useState<string | null>(null);
    const key = JSON.stringify(params);
    const [resolvedKey, setResolvedKey] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        operationalDashboardDataSource
            .load(params)
            .then((data) => {
                if (!cancelled) {
                    setSnapshot(data);
                    setError(null);
                }
            })
            .catch((reason: unknown) => {
                if (!cancelled) {
                    setError(
                        reason instanceof Error
                            ? reason.message
                            : 'Unable to load operational metrics.',
                    );
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setResolvedKey(key);
                }
            });

        return () => {
            cancelled = true;
        };
        // params is represented by the stable serialized key.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    return { snapshot, error, loading: key !== resolvedKey };
}
