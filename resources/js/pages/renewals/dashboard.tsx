import { Head, Link } from '@inertiajs/react';
import MembershipExpiredController from '@/actions/App/Modules/Membership/Controllers/MembershipExpiredController';
import MembershipExpiringController from '@/actions/App/Modules/Membership/Controllers/MembershipExpiringController';
import MembershipGraceController from '@/actions/App/Modules/Membership/Controllers/MembershipGraceController';
import RenewalDashboardController from '@/actions/App/Modules/Membership/Controllers/RenewalDashboardController';
import { EmptyState } from '@/components/shared/empty-state';
import { PageHeader } from '@/components/shared/page-header';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { Membership } from '@/modules/memberships/types';
import type { RenewalStats } from '@/modules/renewals/types';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Renewals', href: RenewalDashboardController.index.url() },
];

export default function RenewalDashboard({
    stats,
    recent_renewals: recentRenewals,
}: {
    stats: RenewalStats;
    recent_renewals: Membership[];
}) {
    return (
        <>
            <Head title="Renewals" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <PageHeader
                    title="Renewals"
                    description="Track upcoming, lapsed and expired memberships in one place."
                />

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Active memberships"
                        value={stats.active}
                        href={undefined}
                    />
                    <StatCard
                        label="Expiring soon"
                        value={stats.expiring_soon}
                        href={MembershipExpiringController.index.url()}
                    />
                    <StatCard
                        label="In grace period"
                        value={stats.in_grace_period}
                        href={MembershipGraceController.index.url()}
                    />
                    <StatCard
                        label="Expired"
                        value={stats.expired}
                        href={MembershipExpiredController.index.url()}
                    />
                </div>

                <div className="rounded-xl border">
                    <div className="p-4 pb-0">
                        <h2 className="text-sm font-medium">
                            Recent renewals
                        </h2>
                    </div>
                    {recentRenewals.length === 0 ? (
                        <EmptyState
                            title="No renewals yet"
                            description="Renewed memberships will show up here."
                        />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Member</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Starts</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentRenewals.map((membership) => (
                                    <TableRow key={membership.id}>
                                        <TableCell>
                                            {membership.member?.full_name}
                                        </TableCell>
                                        <TableCell>
                                            {membership.plan_name}
                                        </TableCell>
                                        <TableCell>
                                            {membership.starts_on}
                                        </TableCell>
                                        <TableCell>
                                            {membership.status_label}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
        </>
    );
}

function StatCard({
    label,
    value,
    href,
}: {
    label: string;
    value: number;
    href?: string;
}) {
    const content = (
        <div className="rounded-xl border p-4 transition-colors hover:bg-muted/50">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold">{value}</p>
        </div>
    );

    return href ? <Link href={href}>{content}</Link> : content;
}

RenewalDashboard.layout = { breadcrumbs };
