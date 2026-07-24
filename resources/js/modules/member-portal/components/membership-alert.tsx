import { AlertTriangle, Snowflake, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { PortalMembership } from '../types';

export function MembershipAlert({
    membership,
}: {
    membership: PortalMembership | null;
}) {
    if (!membership) {
        return (
            <Alert variant="destructive">
                <AlertTriangle />
                <AlertTitle>No active membership</AlertTitle>
                <AlertDescription>
                    Contact the gym to start or renew your membership.
                </AlertDescription>
            </Alert>
        );
    }

    if (membership.status === 'frozen') {
        return (
            <Alert>
                <Snowflake />
                <AlertTitle>Membership frozen</AlertTitle>
                <AlertDescription>
                    Access remains paused
                    {membership.freeze_resumes_on
                        ? ` until ${membership.freeze_resumes_on}`
                        : ''}
                    .
                </AlertDescription>
            </Alert>
        );
    }

    if (membership.status === 'suspended') {
        return (
            <Alert variant="destructive">
                <ShieldAlert />
                <AlertTitle>Membership suspended</AlertTitle>
                <AlertDescription>
                    Please contact the gym before attempting to check in.
                </AlertDescription>
            </Alert>
        );
    }

    return membership.expired ? (
        <Alert variant="destructive">
            <AlertTriangle />
            <AlertTitle>Membership expired</AlertTitle>
            <AlertDescription>
                Your membership expired on {membership.expires_on}. Renew it
                before your next visit.
            </AlertDescription>
        </Alert>
    ) : null;
}
