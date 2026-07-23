import { Head, Link, router, useForm } from '@inertiajs/react';
import { CopyIcon } from 'lucide-react';
import type { FormEvent } from 'react';
import PlanCloneController from '@/actions/App/Http/Controllers/PlanCloneController';
import PlanController from '@/actions/App/Http/Controllers/PlanController';
import { Button } from '@/components/ui/button';
import { PlanForm } from '@/modules/plans/components/plan-form';
import type { PlanFormData } from '@/modules/plans/components/plan-form';
import type { BranchOption, Plan } from '@/modules/plans/types';
import type { BreadcrumbItem } from '@/types';

export default function EditPlan({
    plan,
    branches,
}: {
    plan: Plan;
    branches: BranchOption[];
}) {
    const form = useForm<PlanFormData>({
        name: plan.name,
        description: plan.description ?? '',
        price: String(plan.price),
        joining_fee: String(plan.joining_fee),
        duration_value: String(plan.duration_value),
        duration_unit: plan.duration_unit,
        guest_passes_per_month:
            plan.access_rules.guest_passes_per_month != null
                ? String(plan.access_rules.guest_passes_per_month)
                : '',
        freeze_days_allowed:
            plan.access_rules.freeze_days_allowed != null
                ? String(plan.access_rules.freeze_days_allowed)
                : '',
        classes_included: plan.access_rules.classes_included ?? false,
        available_at_all_branches: plan.available_at_all_branches,
        branch_ids: plan.branches?.map((branch) => branch.id) ?? [],
        status: plan.status,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        form.transform((current) => ({
            ...current,
            guest_passes_per_month: undefined,
            freeze_days_allowed: undefined,
            classes_included: undefined,
            access_rules: {
                guest_passes_per_month: current.guest_passes_per_month || null,
                freeze_days_allowed: current.freeze_days_allowed || null,
                classes_included: current.classes_included,
            },
        }));
        form.put(PlanController.update.url({ plan: plan.id }));
    }

    function cloneplan() {
        router.post(PlanCloneController.store.url({ plan: plan.id }));
    }

    return (
        <>
            <Head title={`Edit ${plan.name}`} />

            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Edit {plan.name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Update pricing, duration and access rules.
                        </p>
                    </div>
                    <Button variant="outline" onClick={cloneplan} type="button">
                        <CopyIcon />
                        Clone
                    </Button>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <PlanForm form={form} branches={branches} />

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={form.processing}>
                            Save changes
                        </Button>
                        <Button variant="outline" asChild>
                            <Link
                                href={PlanController.show.url({
                                    plan: plan.id,
                                })}
                            >
                                Cancel
                            </Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

EditPlan.layout = (props: {
    plan: Plan;
}): { breadcrumbs: BreadcrumbItem[] } => ({
    breadcrumbs: [
        { title: 'Plans', href: PlanController.index.url() },
        {
            title: props.plan.name,
            href: PlanController.show.url({ plan: props.plan.id }),
        },
        {
            title: 'Edit',
            href: PlanController.edit.url({ plan: props.plan.id }),
        },
    ],
});
