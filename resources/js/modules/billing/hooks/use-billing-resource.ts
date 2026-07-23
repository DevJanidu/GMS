import { useCallback, useEffect, useRef, useState } from 'react';

export function useBillingResource<T>(
    load: () => Promise<T>,
    dependencyKey = '',
) {
    const [data, setData] = useState<T>();
    const [error, setError] = useState<Error>();
    const [loading, setLoading] = useState(true);
    const loadRef = useRef(load);

    useEffect(() => {
        loadRef.current = load;
    }, [load]);

    const reload = useCallback(() => {
        queueMicrotask(() => {
            setLoading(true);
            setError(undefined);
            void loadRef
                .current()
                .then(setData)
                .catch((reason: unknown) =>
                    setError(
                        reason instanceof Error
                            ? reason
                            : new Error('Unable to load billing data.'),
                    ),
                )
                .finally(() => setLoading(false));
        });
    }, []);

    useEffect(reload, [dependencyKey, reload]);

    return { data, error, loading, reload };
}
