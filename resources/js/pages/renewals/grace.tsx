import { Head, Link, router } from '@inertiajs/react';
import MembershipController from '@/actions/App/Modules/Membership/Controllers/MembershipController';
import MembershipGraceController from '@/actions/App/Modules/Membership/Controllers/MembershipGraceController';
import { PaginationLinks } from '@/components/pagination-links';
import { EmptyState } from '@/components/shared/empty-state';
import { PageHeader } from '@/components/shared/page-header';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { MembershipStatusBadge } from '@/modules/memberships/components/membership-status-badge';
import type { BranchOption, Membership } from '@/modules/memberships/types';
import type { BreadcrumbItem, Paginated } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Renewals', href: '/renewals' },
    { title: 'Grace period', href: MembershipGraceController.index.url() },
];

export default function GracePeriodMemberships({
    memberships,
    filters,
    branches,
}: {
    memberships: Paginated<Membership>;
    filters: { branch_id: number | null };
    branches: BranchOption[];
}) {
    return (
        <>
            <Head title="Grace period" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <PageHeader
                    title="Grace period"
                    description="Memberships past their expiry date but still within their grace window."
                />

                {branches.length > 1 && (
                    <Select
                        value={
                            filters.branch_id ? String(filters.branch_id) : 'all'
                        }
                        onValueChange={(value) =>
                            router.get(
                                MembershipGraceController.index.url(),
                                {
                                    branch_id:
                                        value === 'all' ? undefined : value,
                                },
                                { preserveState: true, replace: true },
                            )
                        }
                    >
                        <SelectTrigger className="w-44">
                            <SelectValue placeholder="Branch" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All branches</SelectItem>
                            {branches.map((branch) => (
                                <SelectItem
                                    key={branch.id}
                                    value={String(branch.id)}
                                >
                                    {branch.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {memberships.data.length === 0 ? (
                    <EmptyState
                        title="Nobody is in their grace period"
                        description="Memberships that recently expired but still qualify for grace access will show up here."
                    />
                ) : (
                    <div className="rounded-xl border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Member</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Expired on</TableHead>
                                    <TableHead>Grace ends</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {memberships.data.map((membership) => (
                                    <TableRow key={membership.id}>
                                        <TableCell className="font-medium">
                                            <Link
                                                href={MembershipController.show.url(
                                                    {
                                                        membership:
                                                            membership.id,
                                                    },
                                                )}
                                                className="hover:underline"
                                            >
                                                {membership.member?.full_name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            {membership.plan_name}
                                        </TableCell>
                                        <TableCell>
                                            {membership.expires_on}
                                        </TableCell>
                                        <TableCell>
                                            {membership.grace_ends_on}
                                        </TableCell>
                                        <TableCell>
                                            <MembershipStatusBadge
                                                status={membership.status}
                                                inGracePeriod
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                <PaginationLinks links={memberships.meta.links} />
            </div>
        </>
    );
}

GracePeriodMemberships.layout = { breadcrumbs };
