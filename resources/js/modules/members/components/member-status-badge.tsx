import { Badge } from '@/components/ui/badge';
import type { MemberStatus } from '@/modules/members/types';

const labels: Record<MemberStatus, string> = {
    active: 'Active',
    inactive: 'Inactive',
    archived: 'Archived',
};

const variants: Record<MemberStatus, 'default' | 'secondary' | 'outline'> = {
    active: 'default',
    inactive: 'secondary',
    archived: 'outline',
};

export function MemberStatusBadge({ status }: { status: MemberStatus }) {
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}
