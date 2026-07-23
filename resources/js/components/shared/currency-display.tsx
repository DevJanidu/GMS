import { cn, formatCurrency } from '@/lib/utils';

export function CurrencyDisplay({
    amount,
    currency,
    className,
}: {
    amount: number;
    currency: string;
    className?: string;
}) {
    return (
        <span className={cn('tabular-nums', className)}>
            {formatCurrency(amount, currency)}
        </span>
    );
}
