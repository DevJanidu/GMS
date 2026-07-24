import { useCallback, useEffect, useState } from 'react';
import { ApiRequestError } from '@/lib/api/client';

export function useMemberPortalResource<T>(
    load: () => Promise<{ data: T }>,
    dependencyKey = '',
) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let cancelled = false;

        load()
            .then((response) => {
                if (!cancelled) {
                    setData(response.data);
                    setError(null);
                }
            })
            .catch((reason: unknown) => {
                if (!cancelled) {
                    setError(
                        reason instanceof ApiRequestError
                            ? reason.message
                            : 'Unable to load your information. Please try again.',
                    );
                }
            });

        return () => {
            cancelled = true;
        };
        // The caller supplies a stable key for deliberate reloads.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dependencyKey, attempt]);

    const retry = useCallback(() => setAttempt((value) => value + 1), []);

    return { data, error, loading: data === null && error === null, retry };
}
