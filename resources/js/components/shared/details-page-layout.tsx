import { Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Generic "single record" page shell: back link, title/description/status
 * area, primary actions, an optional metadata sidebar, and a main content
 * region. Intended to replace bespoke header markup duplicated across each
 * module's "show" page.
 */
export function DetailsPageLayout({
    backHref,
    backLabel = 'Back',
    title,
    description,
    badge,
    actions,
    sidebar,
    children,
    className,
}: {
    backHref?: string;
    backLabel?: string;
    title: ReactNode;
    description?: ReactNode;
    badge?: ReactNode;
    actions?: ReactNode;
    sidebar?: ReactNode;
    children: ReactNode;
    className?: string;
}) {
    return (
        <main
            className={cn(
                'mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 p-4 sm:p-6',
                className,
            )}
        >
            <div className="flex flex-col gap-4">
                {backHref && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-fit"
                        asChild
                    >
                        <Link href={backHref}>
                            <ChevronLeft />
                            {backLabel}
                        </Link>
                    </Button>
                )}

                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-semibold tracking-tight">
                                {title}
                            </h1>
                            {badge}
                        </div>
                        {description && (
                            <p className="text-muted-foreground mt-1 text-sm">
                                {description}
                            </p>
                        )}
                    </div>
                    {actions && (
                        <div className="flex shrink-0 items-center gap-2">
                            {actions}
                        </div>
                    )}
                </div>
            </div>

            <div
                className={cn(
                    'grid gap-6',
                    sidebar && 'xl:grid-cols-[minmax(0,1fr)_20rem]',
                )}
            >
                <div className="min-w-0 space-y-6">{children}</div>
                {sidebar && <div className="space-y-6">{sidebar}</div>}
            </div>
        </main>
    );
}
