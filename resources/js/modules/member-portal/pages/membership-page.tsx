import { Head } from '@inertiajs/react';
import { EmptyState } from '@/components/shared/empty-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { memberPortalApi } from '../api/member-portal';
import { MembershipAlert } from '../components/membership-alert';
import { PortalPageHeader } from '../components/portal-page-header';
import { PortalState } from '../components/portal-state';
import { useMemberPortalResource } from '../hooks/use-member-portal-resource';

export default function MemberPortalMembershipPage() {
    const resource = useMemberPortalResource(memberPortalApi.membership);

    return (
        <>
            <Head title="My membership" />
            <PortalPageHeader
                title="My membership"
                description="Review your current plan, access status and important dates."
            />
            <PortalState {...resource}>
                {(membership) =>
                    membership ? (
                        <>
                            <MembershipAlert membership={membership} />
                            <Card>
                                <CardHeader>
                                    <CardTitle>{membership.plan_name}</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Status
                                        </p>
                                        <StatusBadge status={membership.status}>
                                            {membership.status_label}
                                        </StatusBadge>
                                    </div>
                                    {[
                                        [
                                            'Branch',
                                            membership.branch?.name ??
                                                'All permitted branches',
                                        ],
                                        ['Start date', membership.starts_on],
                                        ['Expiry date', membership.expires_on],
                                        [
                                            'Grace period ends',
                                            membership.grace_ends_on,
                                        ],
                                    ].map(([label, value]) => (
                                        <div key={label}>
                                            <p className="text-xs font-medium text-muted-foreground">
                                                {label}
                                            </p>
                                            <p className="mt-1 font-medium">
                                                {value}
                                            </p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <EmptyState
                            title="No membership found"
                            description="Contact the gym to begin a membership."
                        />
                    )
                }
            </PortalState>
        </>
    );
}
