import { StatusBadge } from '@/components/shared/status-badge';
import type { MembershipStatus } from '@/modules/memberships/types';

const tones = {
    pending: 'info',
    active: 'success',
    frozen: 'info',
    suspended: 'warning',
    cancelled: 'danger',
    expired: 'neutral',
} as const;

const labels: Record<MembershipStatus, string> = {
    pending: 'Pending',
    active: 'Active',
    frozen: 'Frozen',
    suspended: 'Suspended',
    cancelled: 'Cancelled',
    expired: 'Expired',
};

export function MembershipStatusBadge({
    status,
    inGracePeriod = false,
}: {
    status: MembershipStatus;
    inGracePeriod?: boolean;
}) {
    if (status === 'active' && inGracePeriod) {
        return <StatusBadge tone="warning">Grace period</StatusBadge>;
    }

    return <StatusBadge tone={tones[status]}>{labels[status]}</StatusBadge>;
}
