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

/**
 * Common status strings across modules mapped to a tone, so callers don't
 * each re-derive "active is green, expired is red" from scratch. Falls back
 * to `neutral` for anything unrecognized — pass `tone` explicitly to
 * override.
 */
const STATUS_TONES: Record<string, StatusTone> = {
    active: 'success',
    paid: 'success',
    completed: 'success',
    approved: 'success',
    inactive: 'neutral',
    pending: 'warning',
    expiring: 'warning',
    'expiring-soon': 'warning',
    frozen: 'warning',
    suspended: 'danger',
    expired: 'danger',
    archived: 'neutral',
    cancelled: 'danger',
    canceled: 'danger',
    rejected: 'danger',
    failed: 'danger',
    refunded: 'info',
};

export function toneForStatus(status: string): StatusTone {
    return STATUS_TONES[status.toLowerCase()] ?? 'neutral';
}

export function StatusBadge({
    children,
    tone,
    status,
    className,
    ...props
}: Omit<React.ComponentProps<typeof Badge>, 'variant'> & {
    tone?: StatusTone;
    /** Convenience: infer the tone from a known status string instead of passing `tone` explicitly. */
    status?: string;
}) {
    const resolvedTone = tone ?? (status ? toneForStatus(status) : 'neutral');

    return (
        <Badge
            variant="outline"
            className={cn('rounded-full', tones[resolvedTone], className)}
            {...props}
        >
            {children}
        </Badge>
    );
}
