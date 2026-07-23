import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

export function EmptyState({
    title,
    description,
    icon: Icon = Inbox,
    action,
}: {
    title: string;
    description: string;
    icon?: LucideIcon;
    action?: ReactNode;
}) {
    return (
        <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
            <div className="bg-muted mb-4 rounded-xl p-3">
                <Icon className="text-muted-foreground size-5" />
            </div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-muted-foreground mt-1 max-w-sm text-sm">
                {description}
            </p>
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}
