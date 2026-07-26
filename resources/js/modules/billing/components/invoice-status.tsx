import { Badge } from '@/components/ui/badge';
import type { InvoiceStatus as Status } from '../types';

export function InvoiceStatus({ status }: { status: Status }) {
    const label = status.replaceAll('_', ' ');

    return (
        <Badge
            variant={
                status === 'paid'
                    ? 'default'
                    : status === 'void' || status === 'refunded'
                      ? 'secondary'
                      : 'outline'
            }
            className="capitalize"
        >
            {label}
        </Badge>
    );
}
