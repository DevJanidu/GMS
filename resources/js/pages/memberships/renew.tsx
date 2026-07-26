import { Head } from '@inertiajs/react';
import { useForm, usePage } from '@inertiajs/react';
import MembershipController from '@/actions/App/Modules/Membership/Controllers/MembershipController';
import MembershipRenewalController from '@/actions/App/Modules/Membership/Controllers/MembershipRenewalController';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/utils';
import type { Membership, PlanOption } from '@/modules/memberships/types';
import type { BreadcrumbItem } from '@/types';

export default function RenewMembership({
    membership,
    plans,
}: {
    membership: Membership;
    plans: PlanOption[];
}) {
    const { gym } = usePage().props;
    const currency = gym?.currency ?? 'USD';
    const { data, setData, post, processing, errors } = useForm({
        plan_id: membership.plan_id ? String(membership.plan_id) : '',
        initial_payment: '',
        payment_method: 'cash',
        notes: '',
    });

    const selectedPlan = plans.find((plan) => String(plan.id) === data.plan_id);
    const total = selectedPlan
        ? selectedPlan.price + selectedPlan.joining_fee
        : 0;

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(
            MembershipRenewalController.store.url({
                membership: membership.id,
            }),
        );
    }

    const startsAfter = membership.expires_on;

    return (
        <>
            <Head title="Renew membership" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <PageHeader
                    title={`Renew ${membership.member?.full_name ?? 'membership'}`}
                    description={`Current membership expires ${membership.expires_on}. Renewing now will not lose any remaining paid days — the new period starts right after it ends.`}
                />

                <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <div className="space-y-2 rounded-xl border p-4">
                            <Label htmlFor="plan_id">Plan</Label>
                            <Select
                                value={data.plan_id}
                                onValueChange={(value) =>
                                    setData('plan_id', value)
                                }
                            >
                                <SelectTrigger id="plan_id" className="w-full">
                                    <SelectValue placeholder="Select a plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {plans.map((plan) => (
                                        <SelectItem
                                            key={plan.id}
                                            value={String(plan.id)}
                                        >
                                            {plan.name} —{' '}
                                            {formatCurrency(
                                                plan.price,
                                                currency,
                                            )}{' '}
                                            / {plan.duration_value}{' '}
                                            {plan.duration_unit}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.plan_id && (
                                <p className="text-sm text-destructive">
                                    {errors.plan_id}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-4 rounded-xl border p-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="initial_payment">
                                    Initial payment (optional)
                                </Label>
                                <Input
                                    id="initial_payment"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.initial_payment}
                                    onChange={(e) =>
                                        setData(
                                            'initial_payment',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="payment_method">
                                    Payment method
                                </Label>
                                <Select
                                    value={data.payment_method}
                                    onValueChange={(value) =>
                                        setData('payment_method', value)
                                    }
                                >
                                    <SelectTrigger
                                        id="payment_method"
                                        className="w-full"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">
                                            Cash
                                        </SelectItem>
                                        <SelectItem value="card">
                                            Card
                                        </SelectItem>
                                        <SelectItem value="bank_transfer">
                                            Bank transfer
                                        </SelectItem>
                                        <SelectItem value="online">
                                            Online
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2 rounded-xl border p-4">
                            <Label htmlFor="notes">Notes (optional)</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-xl border p-4">
                            <h2 className="mb-3 text-sm font-medium">
                                Price summary
                            </h2>
                            {selectedPlan ? (
                                <dl className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Plan price
                                        </dt>
                                        <dd>
                                            {formatCurrency(
                                                selectedPlan.price,
                                                currency,
                                            )}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Joining fee
                                        </dt>
                                        <dd>
                                            {formatCurrency(
                                                selectedPlan.joining_fee,
                                                currency,
                                            )}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between border-t pt-2 font-medium">
                                        <dt>Total due</dt>
                                        <dd>
                                            {formatCurrency(
                                                total,
                                                currency,
                                            )}
                                        </dd>
                                    </div>
                                    <p className="pt-1 text-xs text-muted-foreground">
                                        New membership starts after{' '}
                                        {startsAfter}.
                                    </p>
                                </dl>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Select a plan to see pricing.
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            Renew membership
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

RenewMembership.layout = (props: {
    membership: Membership;
}): { breadcrumbs: BreadcrumbItem[] } => ({
    breadcrumbs: [
        { title: 'Memberships', href: MembershipController.index.url() },
        {
            title: props.membership.member?.full_name ?? 'Membership',
            href: MembershipController.show.url({
                membership: props.membership.id,
            }),
        },
        {
            title: 'Renew',
            href: MembershipRenewalController.create.url({
                membership: props.membership.id,
            }),
        },
    ],
});
