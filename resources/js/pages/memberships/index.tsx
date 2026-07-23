import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { useState } from 'react';
import MembershipController from '@/actions/App/Modules/Membership/Controllers/MembershipController';
import { PaginationLinks } from '@/components/pagination-links';
import { EmptyState } from '@/components/shared/empty-state';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    { title: 'Memberships', href: MembershipController.index.url() },
];

type Filters = {
    search: string | null;
    status: string | null;
    branch_id: number | null;
};

export default function MembershipsIndex({
    memberships,
    filters,
    branches,
}: {
    memberships: Paginated<Membership>;
    filters: Filters;
    branches: BranchOption[];
}) {
    const [search, setSearch] = useState(filters.search ?? '');

    function applyFilters(next: Partial<Filters>) {
        router.get(
            MembershipController.index.url(),
            {
                search: next.search ?? filters.search ?? undefined,
                status:
                    next.status !== undefined
                        ? next.status
                        : (filters.status ?? undefined),
                branch_id:
                    next.branch_id !== undefined
                        ? next.branch_id
                        : (filters.branch_id ?? undefined),
            },
            { preserveState: true, replace: true },
        );
    }

    return (
        <>
            <Head title="Memberships" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <PageHeader
                    title="Memberships"
                    description="Every membership sold to a member, with its current lifecycle status."
                    actions={
                        <Button asChild>
                            <Link href={MembershipController.create.url()}>
                                <PlusIcon />
                                Sell membership
                            </Link>
                        </Button>
                    }
                />

                <div className="flex flex-wrap items-center gap-3">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            applyFilters({ search });
                        }}
                        className="relative max-w-sm min-w-[220px] flex-1"
                    >
                        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by member name or number"
                            className="pl-8"
                        />
                    </form>

                    <Select
                        value={filters.status ?? 'all'}
                        onValueChange={(value) =>
                            applyFilters({
                                status: value === 'all' ? null : value,
                            })
                        }
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="frozen">Frozen</SelectItem>
                            <SelectItem value="suspended">
                                Suspended
                            </SelectItem>
                            <SelectItem value="cancelled">
                                Cancelled
                            </SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                    </Select>

                    {branches.length > 1 && (
                        <Select
                            value={
                                filters.branch_id
                                    ? String(filters.branch_id)
                                    : 'all'
                            }
                            onValueChange={(value) =>
                                applyFilters({
                                    branch_id:
                                        value === 'all'
                                            ? null
                                            : Number(value),
                                })
                            }
                        >
                            <SelectTrigger className="w-44">
                                <SelectValue placeholder="Branch" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All branches
                                </SelectItem>
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
                </div>

                {memberships.data.length === 0 ? (
                    <EmptyState
                        title="No memberships found"
                        description="Sell a membership to an existing member to get started."
                        action={
                            <Button asChild>
                                <Link
                                    href={MembershipController.create.url()}
                                >
                                    <PlusIcon />
                                    Sell membership
                                </Link>
                            </Button>
                        }
                    />
                ) : (
                    <div className="rounded-xl border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Member</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Branch</TableHead>
                                    <TableHead>Expires</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {memberships.data.map((membership) => (
                                    <TableRow key={membership.id}>
                                        <TableCell className="font-medium">
                                            <Link
                                                href={MembershipController.show.url(
                                                    { membership: membership.id },
                                                )}
                                                className="hover:underline"
                                            >
                                                {membership.member?.full_name}
                                            </Link>
                                            <div className="text-xs text-muted-foreground">
                                                {
                                                    membership.member
                                                        ?.member_number
                                                }
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {membership.plan_name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {membership.branch?.name}
                                        </TableCell>
                                        <TableCell>
                                            {membership.expires_on}
                                        </TableCell>
                                        <TableCell>
                                            <MembershipStatusBadge
                                                status={membership.status}
                                                inGracePeriod={
                                                    membership.in_grace_period
                                                }
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

MembershipsIndex.layout = { breadcrumbs };
