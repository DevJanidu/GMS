export function Money({
    cents,
    currency = 'LKR',
}: {
    cents: number;
    currency?: string;
}) {
    return (
        <span>
            {new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency,
            }).format(cents / 100)}
        </span>
    );
}
