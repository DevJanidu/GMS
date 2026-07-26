import { Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight, Clock, Lock } from 'lucide-react';
import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type StatCardTone = 'emerald' | 'blue' | 'amber' | 'violet';

const iconTone: Record<StatCardTone, string> = {
    emerald:
        'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
    violet: 'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400',
};

type StatCardBaseProps = {
    label: string;
    icon: LucideIcon;
    tone?: StatCardTone;
    /** Drill-down target — the whole card becomes a link when provided. */
    href?: string;
};

type StatCardReadyProps = StatCardBaseProps & {
    state?: 'ready';
    value: string;
    helper?: string;
    trend?: 'up' | 'down';
};

type StatCardUnavailableProps = StatCardBaseProps & {
    state: 'restricted' | 'pending_integration';
    message: string;
};

export function StatCard(props: StatCardReadyProps | StatCardUnavailableProps) {
    const { label, icon: Icon, tone = 'blue', href } = props;
    const isReady = 'value' in props;

    const body: ReactNode = isReady ? (
        <>
            <p className="text-base font-medium text-muted-foreground">
                {label}
            </p>
            <p className="mt-3 text-3xl font-bold tracking-tight">
                {props.value}
            </p>
            {props.helper && (
                <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                    {props.trend === 'up' && (
                        <ArrowUpRight className="size-3.5 text-emerald-600" />
                    )}
                    {props.trend === 'down' && (
                        <ArrowDownRight className="size-3.5 text-red-500" />
                    )}
                    <span>{props.helper}</span>
                </div>
            )}
        </>
    ) : (
        <>
            <p className="text-base font-medium text-muted-foreground">
                {label}
            </p>
            <p className="mt-4 flex items-center gap-1.5 text-sm leading-relaxed text-muted-foreground">
                {props.state === 'restricted' ? (
                    <Lock className="size-3.5 shrink-0" />
                ) : (
                    <Clock className="size-3.5 shrink-0" />
                )}
                {props.message}
            </p>
        </>
    );

    const card = (
        <Card
            className={cn(
                'min-h-36 gap-4 overflow-hidden py-6',
                href && 'transition-colors hover:bg-muted/40',
            )}
        >
            <CardContent className="flex flex-1 px-6">
                <div className="flex w-full items-center justify-between gap-4">
                    <div className="min-w-0">{body}</div>
                    <div
                        className={cn(
                            'shrink-0 rounded-2xl p-3.5',
                            iconTone[tone],
                        )}
                    >
                        <Icon className="size-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    if (href && isReady) {
        return (
            <Link
                href={href}
                className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                {card}
            </Link>
        );
    }

    return card;
}
