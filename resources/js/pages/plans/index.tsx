import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { useState } from 'react';
import PlanController from '@/actions/App/Http/Controllers/PlanController';
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
import { PlanStatusBadge } from '@/modules/plans/components/plan-status-badge';
import type { Plan } from '@/modules/plans/types';
import type { BreadcrumbItem, Paginated } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Plans', href: PlanController.index.url() },
];

type Filters = {
    search: string | null;
    status: string | null;
};

export default function PlansIndex({
    plans,
    filters,
}: {
    plans: Paginated<Plan>;
    filters: Filters;
}) {
    const [search, setSearch] = useState(filters.search ?? '');

    function applyFilters(next: Partial<Filters>) {
        router.get(
            PlanController.index.url(),
            {
                search: next.search ?? filters.search ?? undefined,
                status: next.status ?? filters.status ?? undefined,
            },
            { preserveState: true, replace: true },
        );
    }

    return (
        <>
            <Head title="Plans" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Membership plans
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Create and manage the plans members can buy.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={PlanController.create.url()}>
                            <PlusIcon />
                            Create plan
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
                            placeholder="Search by name"
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
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Availability</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {plans.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No plans found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {plans.data.map((plan) => (
                                <TableRow key={plan.id}>
                                    <TableCell className="font-medium">
                                        <Link
                                            href={PlanController.show.url({
                                                plan: plan.id,
                                            })}
                                            className="hover:underline"
                                        >
                                            {plan.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        ${plan.price.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        {plan.duration_value}{' '}
                                        {plan.duration_unit}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {plan.available_at_all_branches
                                            ? 'All branches'
                                            : 'Restricted'}
                                    </TableCell>
                                    <TableCell>
                                        <PlanStatusBadge status={plan.status} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <PaginationLinks links={plans.meta.links} />
            </div>
        </>
    );
}

PlansIndex.layout = { breadcrumbs };
