import type { ReactNode } from 'react';

export function PortalRowCard({
    title,
    subtitle,
    trailing,
    meta,
}: {
    title: ReactNode;
    subtitle?: ReactNode;
    trailing?: ReactNode;
    meta?: ReactNode;
}) {
    return (
        <div className="rounded-xl border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{title}</p>
                    {subtitle && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {subtitle}
                        </p>
                    )}
                </div>
                {trailing && (
                    <div className="shrink-0 text-right text-sm font-semibold">
                        {trailing}
                    </div>
                )}
            </div>
            {meta && (
                <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    {meta}
                </div>
            )}
        </div>
    );
}
