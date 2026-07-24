export function PortalMoney({
    cents,
    currency = 'USD',
}: {
    cents: number;
    currency?: string | null;
}) {
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currency || 'USD',
    }).format(cents / 100);
}
