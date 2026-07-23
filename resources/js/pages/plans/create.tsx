import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import PlanController from '@/actions/App/Http/Controllers/PlanController';
import { Button } from '@/components/ui/button';
import { PlanForm } from '@/modules/plans/components/plan-form';
import type { PlanFormData } from '@/modules/plans/components/plan-form';
import type { BranchOption } from '@/modules/plans/types';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Plans', href: PlanController.index.url() },
    { title: 'Create plan', href: PlanController.create.url() },
];

export default function CreatePlan({ branches }: { branches: BranchOption[] }) {
    const form = useForm<PlanFormData>({
        name: '',
        description: '',
        price: '',
        joining_fee: '0',
        duration_value: '1',
        duration_unit: 'months',
        guest_passes_per_month: '',
        freeze_days_allowed: '',
        classes_included: false,
        available_at_all_branches: true,
        branch_ids: [],
        status: 'active',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        form.transform(
            ({
                guest_passes_per_month,
                freeze_days_allowed,
                classes_included,
                ...rest
            }) => ({
                ...rest,
                access_rules: {
                    guest_passes_per_month: guest_passes_per_month || null,
                    freeze_days_allowed: freeze_days_allowed || null,
                    classes_included,
                },
            }),
        );
        form.post(PlanController.store.url());
    }

    return (
        <>
            <Head title="Create plan" />

            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">
                        Create plan
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Define pricing, duration and access rules.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <PlanForm form={form} branches={branches} />

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={form.processing}>
                            Create plan
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={PlanController.index.url()}>
                                Cancel
                            </Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CreatePlan.layout = { breadcrumbs };
