import { Head, Link, router } from '@inertiajs/react';
import { CopyIcon, PencilIcon } from 'lucide-react';
import PlanCloneController from '@/actions/App/Http/Controllers/PlanCloneController';
import PlanController from '@/actions/App/Http/Controllers/PlanController';
import PlanStatusController from '@/actions/App/Http/Controllers/PlanStatusController';
import { Button } from '@/components/ui/button';
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
import type { BreadcrumbItem } from '@/types';

export default function ShowPlan({ plan }: { plan: Plan }) {
    function toggleStatus() {
        router.patch(
            PlanStatusController.update.url({ plan: plan.id }),
            { status: plan.status === 'active' ? 'inactive' : 'active' },
            { preserveScroll: true },
        );
    }

    function clonePlan() {
        router.post(PlanCloneController.store.url({ plan: plan.id }));
    }

    return (
        <>
            <Head title={plan.name} />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-semibold tracking-tight">
                                {plan.name}
                            </h1>
                            <PlanStatusBadge status={plan.status} />
                        </div>
                        {plan.description && (
                            <p className="mt-1 text-sm text-muted-foreground">
                                {plan.description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={clonePlan}>
                            <CopyIcon />
                            Clone
                        </Button>
                        <Button variant="outline" onClick={toggleStatus}>
                            {plan.status === 'active'
                                ? 'Deactivate'
                                : 'Activate'}
                        </Button>
                        <Button asChild>
                            <Link
                                href={PlanController.edit.url({
                                    plan: plan.id,
                                })}
                            >
                                <PencilIcon />
                                Edit
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <Stat label="Price" value={`$${plan.price.toFixed(2)}`} />
                    <Stat
                        label="Joining fee"
                        value={`$${plan.joining_fee.toFixed(2)}`}
                    />
                    <Stat
                        label="Duration"
                        value={`${plan.duration_value} ${plan.duration_unit}`}
                    />
                </div>

                <div className="rounded-xl border p-4">
                    <h2 className="mb-2 text-sm font-medium">
                        Branch availability
                    </h2>
                    {plan.available_at_all_branches ? (
                        <p className="text-sm text-muted-foreground">
                            Available at all branches.
                        </p>
                    ) : plan.branches && plan.branches.length > 0 ? (
                        <ul className="flex flex-wrap gap-2 text-sm">
                            {plan.branches.map((branch) => (
                                <li
                                    key={branch.id}
                                    className="rounded-md bg-muted px-2 py-1"
                                >
                                    {branch.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No branches assigned yet.
                        </p>
                    )}
                </div>

                <div className="rounded-xl border">
                    <div className="p-4 pb-0">
                        <h2 className="text-sm font-medium">Price history</h2>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Price</TableHead>
                                <TableHead>Joining fee</TableHead>
                                <TableHead>Effective from</TableHead>
                                <TableHead>Effective until</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(plan.price_history ?? []).map((entry) => (
                                <TableRow key={entry.id}>
                                    <TableCell>
                                        ${entry.price.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        ${entry.joining_fee.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        {entry.effective_from}
                                    </TableCell>
                                    <TableCell>
                                        {entry.effective_until ?? 'Current'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-lg font-semibold">{value}</p>
        </div>
    );
}

ShowPlan.layout = (props: {
    plan: Plan;
}): { breadcrumbs: BreadcrumbItem[] } => ({
    breadcrumbs: [
        { title: 'Plans', href: PlanController.index.url() },
        {
            title: props.plan.name,
            href: PlanController.show.url({ plan: props.plan.id }),
        },
    ],
});
