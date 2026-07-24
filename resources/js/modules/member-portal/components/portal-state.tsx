import type { ReactNode } from 'react';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { PageLoading } from '@/components/shared/page-loading';

export function PortalState<T>({
    data,
    loading,
    error,
    retry,
    emptyTitle,
    emptyDescription,
    children,
}: {
    data: T | null;
    loading: boolean;
    error: string | null;
    retry: () => void;
    emptyTitle?: string;
    emptyDescription?: string;
    children: (data: T) => ReactNode;
}) {
    if (loading) {
        return <PageLoading />;
    }

    if (error) {
        return <ErrorState description={error} onRetry={retry} />;
    }

    if (data === null) {
        return (
            <EmptyState
                title={emptyTitle ?? 'Nothing to show'}
                description={
                    emptyDescription ??
                    'There is no information available for your account yet.'
                }
            />
        );
    }

    return <>{children(data)}</>;
}
