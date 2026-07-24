import { useCallback, useEffect, useState } from 'react';
import { ApiRequestError } from '@/lib/api/client';
import type { ApiPage } from '../types';

export function useMemberPortalPage<T>(
    load: (page: number) => Promise<ApiPage<T>>,
) {
    const [page, setPage] = useState(1);
    const [response, setResponse] = useState<ApiPage<T> | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let cancelled = false;

        load(page)
            .then((result) => {
                if (!cancelled) {
                    setResponse(result);
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
        // The API function is intentionally stable at the call site.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, attempt]);

    const retry = useCallback(() => setAttempt((value) => value + 1), []);

    return {
        data: response?.data ?? null,
        meta: response?.meta ?? null,
        error,
        loading: response === null && error === null,
        page,
        setPage,
        retry,
    };
}
