import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function StatCard({
    label,
    value,
    helper,
    trend,
    icon: Icon,
    tone = 'blue',
}: {
    label: string;
    value: string;
    helper: string;
    trend?: 'up' | 'down';
    icon: LucideIcon;
    tone?: 'emerald' | 'blue' | 'amber' | 'violet';
}) {
    const iconTone = {
        emerald:
            'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
        amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
        violet:
            'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400',
    }[tone];

    return (
        <Card className="gap-4 overflow-hidden py-5">
            <CardContent className="px-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-muted-foreground text-sm font-medium">
                            {label}
                        </p>
                        <p className="mt-2 text-2xl font-bold tracking-tight">
                            {value}
                        </p>
                    </div>
                    <div className={cn('rounded-xl p-2.5', iconTone)}>
                        <Icon className="size-5" />
                    </div>
                </div>
                <div className="text-muted-foreground mt-4 flex items-center gap-1.5 text-xs">
                    {trend === 'up' && (
                        <ArrowUpRight className="size-3.5 text-emerald-600" />
                    )}
                    {trend === 'down' && (
                        <ArrowDownRight className="size-3.5 text-red-500" />
                    )}
                    <span>{helper}</span>
                </div>
            </CardContent>
        </Card>
    );
}
