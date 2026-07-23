import { Clock, Lock } from 'lucide-react';
import type { ReactNode } from 'react';
import { EmptyState } from '@/components/shared/empty-state';
import type { DashboardSection } from '../types';

/**
 * Renders a card-sized body for a `DashboardSection`: real content when
 * `available`, or a distinct empty state for `restricted` (permission) vs
 * `pending_integration` (the owning module hasn't published its API yet).
 * Keeping these visually distinct matters — one is "you can't see this",
 * the other is "no one can see this yet".
 */
export function SectionBoundary<T>({
    section,
    children,
}: {
    section: DashboardSection<T>;
    children: (data: T) => ReactNode;
}) {
    if (section.status === 'available') {
        return <>{children(section.data)}</>;
    }

    if (section.status === 'restricted') {
        return (
            <EmptyState
                icon={Lock}
                title="Restricted"
                description={section.message}
            />
        );
    }

    return (
        <EmptyState
            icon={Clock}
            title="Awaiting integration"
            description={section.message}
        />
    );
}
