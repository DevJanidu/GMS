import { Badge } from '@/components/ui/badge';

export function UnreadCounter({ count }: { count: number }) {
    return (
        <Badge
            variant={count > 0 ? 'default' : 'secondary'}
            aria-label={`${count} unread notifications`}
        >
            {count} unread
        </Badge>
    );
}
