import type { LucideIcon } from 'lucide-react';
import { Activity } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';

export type ActivityTimelineItem = {
    id: string | number;
    title: string;
    detail?: string;
    /** Pre-formatted, relative or absolute — callers own the formatting. */
    timeLabel: string;
    icon?: LucideIcon;
};

export function ActivityTimeline({
    items,
    emptyTitle = 'No recent activity',
    emptyDescription = 'Activity will appear here as it happens.',
}: {
    items: ActivityTimelineItem[];
    emptyTitle?: string;
    emptyDescription?: string;
}) {
    if (items.length === 0) {
        return (
            <EmptyState
                icon={Activity}
                title={emptyTitle}
                description={emptyDescription}
            />
        );
    }

    return (
        <ol className="space-y-5">
            {items.map((item) => {
                const Icon = item.icon ?? Activity;

                return (
                    <li key={item.id} className="flex gap-3">
                        <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-full">
                            <Icon className="text-primary size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">{item.title}</p>
                            {item.detail && (
                                <p className="text-muted-foreground truncate text-xs">
                                    {item.detail}
                                </p>
                            )}
                        </div>
                        <span className="text-muted-foreground shrink-0 text-[11px]">
                            {item.timeLabel}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}
