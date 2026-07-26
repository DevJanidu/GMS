import { Head, Link, router, usePage } from '@inertiajs/react';
import { Building2, Clock, CopyIcon, PencilIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import PlanCloneController from '@/actions/App/Http/Controllers/PlanCloneController';
import PlanController from '@/actions/App/Http/Controllers/PlanController';
import PlanStatusController from '@/actions/App/Http/Controllers/PlanStatusController';
import { DetailRow } from '@/components/detail-row';
import { CurrencyDisplay } from '@/components/shared/currency-display';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
    const { gym } = usePage().props;
    const currency = gym?.currency ?? 'USD';

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

    const branchesLabel = plan.available_at_all_branches
        ? 'All branches'
        : (plan.branches ?? []).map((branch) => branch.name).join(', ') ||
          null;

    return (
        <>
            <Head title={plan.name} />

            <div className="flex flex-1 flex-col gap-6">
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
                    <Stat
                        label="Price"
                        value={
                            <CurrencyDisplay
                                amount={plan.price}
                                currency={currency}
                            />
                        }
                    />
                    <Stat
                        label="Joining fee"
                        value={
                            <CurrencyDisplay
                                amount={plan.joining_fee}
                                currency={currency}
                            />
                        }
                    />
                    <Stat
                        label="Duration"
                        value={`${plan.duration_value} ${plan.duration_unit}`}
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Price history</CardTitle>
                            </CardHeader>
                            <CardContent className="px-0 pt-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Joining fee</TableHead>
                                            <TableHead>
                                                Effective from
                                            </TableHead>
                                            <TableHead>
                                                Effective until
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(plan.price_history ?? []).length ===
                                            0 && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={4}
                                                    className="text-center text-sm text-muted-foreground"
                                                >
                                                    No price changes yet.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {(plan.price_history ?? []).map(
                                            (entry) => (
                                                <TableRow key={entry.id}>
                                                    <TableCell>
                                                        <CurrencyDisplay
                                                            amount={
                                                                entry.price
                                                            }
                                                            currency={
                                                                currency
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <CurrencyDisplay
                                                            amount={
                                                                entry.joining_fee
                                                            }
                                                            currency={
                                                                currency
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {entry.effective_from}
                                                    </TableCell>
                                                    <TableCell>
                                                        {entry.effective_until ??
                                                            'Current'}
                                                    </TableCell>
                                                </TableRow>
                                            ),
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <DetailRow
                                    icon={<Building2 className="size-4" />}
                                    label="Branch availability"
                                    value={branchesLabel}
                                />
                                <DetailRow
                                    icon={<Clock className="size-4" />}
                                    label="Duration"
                                    value={`${plan.duration_value} ${plan.duration_unit}`}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

function Stat({ label, value }: { label: string; value: ReactNode }) {
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
