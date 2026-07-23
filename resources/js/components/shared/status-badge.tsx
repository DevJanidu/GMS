import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const tones: Record<StatusTone, string> = {
    success:
        'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
    warning:
        'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
    danger:
        'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300',
    info: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300',
    neutral: 'border-border bg-muted text-muted-foreground',
};

export function StatusBadge({
    children,
    tone = 'neutral',
    className,
}: React.ComponentProps<typeof Badge> & { tone?: StatusTone }) {
    return (
        <Badge
            variant="outline"
            className={cn('rounded-full', tones[tone], className)}
        >
            {children}
        </Badge>
    );
}
