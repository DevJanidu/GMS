import { Badge } from '@/components/ui/badge';
import type { PlanStatus } from '@/modules/plans/types';

export function PlanStatusBadge({ status }: { status: PlanStatus }) {
    return (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
            {status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
    );
}
