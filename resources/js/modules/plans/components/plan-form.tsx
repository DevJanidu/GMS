import type { InertiaFormProps } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { MoneyInput } from '@/components/shared/money-input';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { BranchOption } from '@/modules/plans/types';

export type PlanFormData = {
    name: string;
    description: string;
    price: string;
    joining_fee: string;
    duration_value: string;
    duration_unit: string;
    available_at_all_branches: boolean;
    branch_ids: number[];
    status: string;
};

export function PlanForm({
    form,
    branches,
    currency,
    showStatus = true,
}: {
    form: InertiaFormProps<PlanFormData>;
    branches: BranchOption[];
    currency: string;
    showStatus?: boolean;
}) {
    const { data, setData, errors } = form;

    function toggleBranch(branchId: number, checked: boolean) {
        setData(
            'branch_ids',
            checked
                ? [...data.branch_ids, branchId]
                : data.branch_ids.filter((id) => id !== branchId),
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="name">Plan name</Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                    />
                    <InputError message={errors.description} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="price">Price</Label>
                    <MoneyInput
                        id="price"
                        currency={currency}
                        value={data.price === '' ? null : Number(data.price)}
                        onChange={(value) =>
                            setData('price', value === null ? '' : String(value))
                        }
                        required
                    />
                    <InputError message={errors.price} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="joining_fee">Joining fee</Label>
                    <MoneyInput
                        id="joining_fee"
                        currency={currency}
                        value={
                            data.joining_fee === ''
                                ? null
                                : Number(data.joining_fee)
                        }
                        onChange={(value) =>
                            setData(
                                'joining_fee',
                                value === null ? '' : String(value),
                            )
                        }
                    />
                    <InputError message={errors.joining_fee} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="duration_value">Duration</Label>
                    <Input
                        id="duration_value"
                        type="number"
                        min="1"
                        value={data.duration_value}
                        onChange={(e) =>
                            setData('duration_value', e.target.value)
                        }
                        required
                    />
                    <InputError message={errors.duration_value} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="duration_unit">Duration unit</Label>
                    <Select
                        value={data.duration_unit}
                        onValueChange={(value) =>
                            setData('duration_unit', value)
                        }
                    >
                        <SelectTrigger id="duration_unit" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="days">Days</SelectItem>
                            <SelectItem value="weeks">Weeks</SelectItem>
                            <SelectItem value="months">Months</SelectItem>
                            <SelectItem value="years">Years</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.duration_unit} />
                </div>

                {showStatus && (
                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={data.status}
                            onValueChange={(value) => setData('status', value)}
                        >
                            <SelectTrigger id="status" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">
                                    Inactive
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>
                )}
            </div>

            <div className="space-y-3 rounded-xl border p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium">
                            Branch availability
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Let members buy this plan at every branch, or
                            restrict it to specific branches.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="available_at_all_branches">
                            All branches
                        </Label>
                        <Switch
                            id="available_at_all_branches"
                            checked={data.available_at_all_branches}
                            onCheckedChange={(checked) =>
                                setData('available_at_all_branches', checked)
                            }
                        />
                    </div>
                </div>

                {!data.available_at_all_branches && (
                    <div className="grid gap-2 sm:grid-cols-2">
                        {branches.map((branch) => (
                            <label
                                key={branch.id}
                                className="flex items-center gap-2 text-sm"
                            >
                                <Checkbox
                                    checked={data.branch_ids.includes(
                                        branch.id,
                                    )}
                                    onCheckedChange={(checked) =>
                                        toggleBranch(
                                            branch.id,
                                            checked === true,
                                        )
                                    }
                                />
                                {branch.name}
                            </label>
                        ))}
                        <InputError message={errors.branch_ids} />
                    </div>
                )}
            </div>
        </div>
    );
}
