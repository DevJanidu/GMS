import { BranchFilter } from '@/components/shared/branch-filter';
import type { BranchFilterOption } from '@/components/shared/branch-filter';
import { DateRangePicker } from '@/components/shared/date-range-picker';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type {
    ReportDefinition,
    ReportFilters,
} from '../types';

type Option = { id: number; name: string };

export function ReportFilterPanel({
    definition,
    filters,
    onChange,
    branches = [],
    plans = [],
}: {
    definition: ReportDefinition;
    filters: ReportFilters;
    onChange: (filters: ReportFilters) => void;
    branches?: BranchFilterOption[];
    plans?: Option[];
}) {
    const includes = (name: ReportDefinition['filters'][number]) =>
        definition.filters.includes(name);

    return (
        <section
            className="flex flex-wrap items-center gap-2 rounded-xl border bg-card p-3 print:hidden"
            aria-label="Report filters"
        >
            {includes('date_range') && (
                <DateRangePicker
                    value={{
                        from: filters.date_from,
                        to: filters.date_to,
                    }}
                    onChange={(range) =>
                        onChange({
                            ...filters,
                            date_from: range.from,
                            date_to: range.to,
                            page: 1,
                        })
                    }
                />
            )}
            {includes('branch') && (
                <BranchFilter
                    branches={branches}
                    value={filters.branch_id}
                    onChange={(branch_id) =>
                        onChange({ ...filters, branch_id, page: 1 })
                    }
                />
            )}
            {includes('plan') && (
                <Select
                    value={filters.plan_id ? String(filters.plan_id) : 'all'}
                    onValueChange={(value) =>
                        onChange({
                            ...filters,
                            plan_id: value === 'all' ? null : Number(value),
                            page: 1,
                        })
                    }
                    disabled={plans.length === 0}
                >
                    <SelectTrigger className="w-48" aria-label="Membership plan">
                        <SelectValue placeholder="All plans" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All plans</SelectItem>
                        {plans.map((plan) => (
                            <SelectItem key={plan.id} value={String(plan.id)}>
                                {plan.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {includes('member_status') && (
                <Select
                    value={filters.member_status ?? 'all'}
                    onValueChange={(value) =>
                        onChange({
                            ...filters,
                            member_status: value === 'all' ? null : value,
                            page: 1,
                        })
                    }
                >
                    <SelectTrigger className="w-44" aria-label="Member status">
                        <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {includes('payment_method') && (
                <Select
                    value={filters.payment_method ?? 'all'}
                    onValueChange={(value) =>
                        onChange({
                            ...filters,
                            payment_method: value === 'all' ? null : value,
                            page: 1,
                        })
                    }
                >
                    <SelectTrigger className="w-48" aria-label="Payment method">
                        <SelectValue placeholder="All methods" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All methods</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="bank_transfer">
                            Bank transfer
                        </SelectItem>
                        <SelectItem value="digital_wallet">
                            Digital wallet
                        </SelectItem>
                    </SelectContent>
                </Select>
            )}
        </section>
    );
}
