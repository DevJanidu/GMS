import { useId } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const CURRENCY_SYMBOLS: Record<string, string> = {
    USD: '$',
    LKR: 'Rs',
    EUR: '€',
    GBP: '£',
    INR: '₹',
};

function symbolFor(currency: string): string {
    return CURRENCY_SYMBOLS[currency] ?? currency;
}

/**
 * Controlled numeric input for decimal money values (major currency units,
 * e.g. dollars — never cents, matching how prices are stored on the
 * backend). Emits `null` while the field is empty so callers can
 * distinguish "not entered" from zero.
 */
export function MoneyInput({
    id,
    value,
    currency,
    onChange,
    disabled,
    className,
    ...props
}: {
    id?: string;
    value: number | null;
    currency: string;
    onChange: (value: number | null) => void;
    disabled?: boolean;
    className?: string;
} & Omit<
    React.ComponentProps<typeof Input>,
    'id' | 'value' | 'onChange' | 'disabled' | 'className' | 'type'
>) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
        <div className="relative">
            <span
                className="text-muted-foreground pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm"
                aria-hidden
            >
                {symbolFor(currency)}
            </span>
            <Input
                id={inputId}
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                disabled={disabled}
                value={value ?? ''}
                onChange={(event) => {
                    const raw = event.target.value;

                    onChange(raw === '' ? null : Number(raw));
                }}
                className={cn('pl-10', className)}
                {...props}
            />
        </div>
    );
}
