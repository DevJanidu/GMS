import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import MembershipController from '@/actions/App/Modules/Membership/Controllers/MembershipController';
import MembershipExpiringController from '@/actions/App/Modules/Membership/Controllers/MembershipExpiringController';
import MembershipReminderController from '@/actions/App/Modules/Membership/Controllers/MembershipReminderController';
import { PaginationLinks } from '@/components/pagination-links';
import { EmptyState } from '@/components/shared/empty-state';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
    { title: 'Expiring soon', href: MembershipExpiringController.index.url() },
];

export default function ExpiringMemberships({
    memberships,
    filters,
    branches,
}: {
    memberships: Paginated<Membership>;
    filters: { branch_id: number | null };
    branches: BranchOption[];
}) {
    const [selected, setSelected] = useState<number[]>([]);

    function toggle(id: number) {
        setSelected((current) =>
            current.includes(id)
                ? current.filter((value) => value !== id)
                : [...current, id],
        );
    }

    function toggleAll() {
        setSelected((current) =>
            current.length === memberships.data.length
                ? []
                : memberships.data.map((membership) => membership.id),
        );
    }

    function sendReminders() {
        router.post(
            MembershipReminderController.store.url(),
            { membership_ids: selected },
            { preserveScroll: true, onSuccess: () => setSelected([]) },
        );
    }

    return (
        <>
            <Head title="Expiring soon" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <PageHeader
                    title="Expiring soon"
                    description="Memberships approaching their expiry date and not yet renewed."
                    actions={
                        selected.length > 0 ? (
                            <Button onClick={sendReminders}>
                                Send reminder ({selected.length})
                            </Button>
                        ) : undefined
                    }
                />

                {branches.length > 1 && (
                    <Select
                        value={
                            filters.branch_id ? String(filters.branch_id) : 'all'
                        }
                        onValueChange={(value) =>
                            router.get(
                                MembershipExpiringController.index.url(),
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
                        title="Nothing expiring soon"
                        description="Memberships will show up here as their expiry date approaches."
                    />
                ) : (
                    <div className="rounded-xl border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-10">
                                        <Checkbox
                                            checked={
                                                selected.length ===
                                                    memberships.data.length &&
                                                memberships.data.length > 0
                                            }
                                            onCheckedChange={toggleAll}
                                        />
                                    </TableHead>
                                    <TableHead>Member</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Expires</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {memberships.data.map((membership) => (
                                    <TableRow key={membership.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selected.includes(
                                                    membership.id,
                                                )}
                                                onCheckedChange={() =>
                                                    toggle(membership.id)
                                                }
                                            />
                                        </TableCell>
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
                                            <MembershipStatusBadge
                                                status={membership.status}
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

ExpiringMemberships.layout = { breadcrumbs };
