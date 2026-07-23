import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { useState } from 'react';
import MemberController from '@/actions/App/Http/Controllers/MemberController';
import { PaginationLinks } from '@/components/pagination-links';
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
import { MemberStatusBadge } from '@/modules/members/components/member-status-badge';
import type { BranchOption, Member } from '@/modules/members/types';
import type { BreadcrumbItem, Paginated } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Members', href: MemberController.index.url() },
];

type Filters = {
    search: string | null;
    status: string | null;
    branch_id: number | null;
};

export default function MembersIndex({
    members,
    filters,
    branches,
}: {
    members: Paginated<Member>;
    filters: Filters;
    branches: BranchOption[];
}) {
    const [search, setSearch] = useState(filters.search ?? '');

    function applyFilters(next: Partial<Filters>) {
        router.get(
            MemberController.index.url(),
            {
                search: next.search ?? filters.search ?? undefined,
                status: next.status ?? filters.status ?? undefined,
                branch_id: next.branch_id ?? filters.branch_id ?? undefined,
            },
            { preserveState: true, replace: true },
        );
    }

    return (
        <>
            <Head title="Members" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Members
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Register and manage gym members.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={MemberController.create.url()}>
                            <PlusIcon />
                            Register member
                        </Link>
                    </Button>
                </div>

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
                            placeholder="Search by name, number, email or phone"
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
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={
                            filters.branch_id
                                ? String(filters.branch_id)
                                : 'all'
                        }
                        onValueChange={(value) =>
                            applyFilters({
                                branch_id:
                                    value === 'all' ? null : Number(value),
                            })
                        }
                    >
                        <SelectTrigger className="w-48">
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
                </div>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Member #</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Branch</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Joined</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No members found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {members.data.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell className="font-medium">
                                        <Link
                                            href={MemberController.show.url({
                                                member: member.id,
                                            })}
                                            className="hover:underline"
                                        >
                                            {member.member_number}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{member.full_name}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {member.email ?? member.phone ?? '—'}
                                    </TableCell>
                                    <TableCell>
                                        {member.branch?.name ?? '—'}
                                    </TableCell>
                                    <TableCell>
                                        <MemberStatusBadge
                                            status={member.status}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {member.joined_at ?? '—'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <PaginationLinks links={members.meta.links} />
            </div>
        </>
    );
}

MembersIndex.layout = { breadcrumbs };
