import { useForm, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import MembershipController from '@/actions/App/Modules/Membership/Controllers/MembershipController';
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
import type { MemberOption, PlanOption } from '@/modules/memberships/types';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Memberships', href: MembershipController.index.url() },
    { title: 'Sell membership', href: MembershipController.create.url() },
];

export default function CreateMembership({
    members,
    plans,
    last_created_member: lastCreatedMember,
    preselected_member_id: preselectedMemberId,
}: {
    members: MemberOption[];
    plans: PlanOption[];
    last_created_member: MemberOption | null;
    preselected_member_id: number | null;
}) {
    const { gym } = usePage().props;
    const currency = gym?.currency ?? 'USD';
    const [memberSearch, setMemberSearch] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        member_id: preselectedMemberId ? String(preselectedMemberId) : '',
        plan_id: '',
        branch_id: '',
        starts_on: '',
        initial_payment: '',
        payment_method: 'cash',
        notes: '',
    });

    const selectedMember = members.find(
        (member) => String(member.id) === data.member_id,
    );

    const selectedPlan = plans.find((plan) => String(plan.id) === data.plan_id);

    const filteredMembers = useMemo(() => {
        if (memberSearch.trim() === '') {
            return [];
        }

        const query = memberSearch.toLowerCase();

        return members
            .filter(
                (member) =>
                    member.full_name.toLowerCase().includes(query) ||
                    member.member_number.toLowerCase().includes(query) ||
                    member.email?.toLowerCase().includes(query),
            )
            .slice(0, 20);
    }, [members, memberSearch]);

    const total = selectedPlan
        ? selectedPlan.price + selectedPlan.joining_fee
        : 0;

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(MembershipController.store.url());
    }

    return (
        <>
            <Head title="Sell membership" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <PageHeader
                    title="Sell membership"
                    description="Sell a plan to an existing member, with an immediate or future start date."
                />

                <form
                    onSubmit={submit}
                    className="grid gap-6 lg:grid-cols-3"
                >
                    <div className="space-y-6 lg:col-span-2">
                        <div className="space-y-2 rounded-xl border p-4">
                            <Label htmlFor="member_search">Member</Label>
                            {selectedMember ? (
                                <div className="flex items-center justify-between rounded-md border bg-muted px-3 py-2 text-sm">
                                    <span>
                                        {selectedMember.full_name} (
                                        {selectedMember.member_number})
                                    </span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setData('member_id', '')}
                                    >
                                        Change
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <Input
                                        id="member_search"
                                        value={memberSearch}
                                        onChange={(e) =>
                                            setMemberSearch(e.target.value)
                                        }
                                        placeholder="Search by name, member number or email"
                                    />
                                    {memberSearch.trim() === '' ? (
                                        lastCreatedMember ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData(
                                                        'member_id',
                                                        String(
                                                            lastCreatedMember.id,
                                                        ),
                                                    )
                                                }
                                                className="flex w-full flex-col items-start rounded-md border px-3 py-2 text-left text-sm hover:bg-muted"
                                            >
                                                <span className="text-xs font-medium text-muted-foreground">
                                                    Just registered
                                                </span>
                                                <span>
                                                    {
                                                        lastCreatedMember.full_name
                                                    }
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {
                                                        lastCreatedMember.member_number
                                                    }
                                                    {lastCreatedMember.email &&
                                                        ` · ${lastCreatedMember.email}`}
                                                </span>
                                            </button>
                                        ) : (
                                            <p className="p-3 text-sm text-muted-foreground">
                                                Search by name, member number
                                                or email to find a member.
                                            </p>
                                        )
                                    ) : (
                                        <div className="max-h-56 overflow-y-auto rounded-md border">
                                            {filteredMembers.length === 0 && (
                                                <p className="p-3 text-sm text-muted-foreground">
                                                    No members match your
                                                    search.
                                                </p>
                                            )}
                                            {filteredMembers.map((member) => (
                                                <button
                                                    type="button"
                                                    key={member.id}
                                                    onClick={() =>
                                                        setData(
                                                            'member_id',
                                                            String(member.id),
                                                        )
                                                    }
                                                    className="flex w-full flex-col items-start border-b px-3 py-2 text-left text-sm last:border-b-0 hover:bg-muted"
                                                >
                                                    <span>
                                                        {member.full_name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {member.member_number}
                                                        {member.email &&
                                                            ` · ${member.email}`}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                            {errors.member_id && (
                                <p className="text-sm text-destructive">
                                    {errors.member_id}
                                </p>
                            )}
                        </div>

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
                                <Label htmlFor="starts_on">
                                    Start date (optional)
                                </Label>
                                <Input
                                    id="starts_on"
                                    type="date"
                                    value={data.starts_on}
                                    onChange={(e) =>
                                        setData('starts_on', e.target.value)
                                    }
                                />
                                <p className="text-xs text-muted-foreground">
                                    Leave blank to start immediately today.
                                </p>
                                {errors.starts_on && (
                                    <p className="text-sm text-destructive">
                                        {errors.starts_on}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="branch_id">
                                    Branch (optional)
                                </Label>
                                <Input
                                    id="branch_id"
                                    type="number"
                                    value={data.branch_id}
                                    onChange={(e) =>
                                        setData('branch_id', e.target.value)
                                    }
                                    placeholder="Defaults to your current branch"
                                />
                                {errors.branch_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.branch_id}
                                    </p>
                                )}
                            </div>
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
                                {errors.initial_payment && (
                                    <p className="text-sm text-destructive">
                                        {errors.initial_payment}
                                    </p>
                                )}
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
                            Sell membership
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CreateMembership.layout = { breadcrumbs };
