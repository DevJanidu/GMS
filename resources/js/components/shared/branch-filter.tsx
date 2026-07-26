import { Building2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export type BranchFilterOption = {
    id: number;
    name: string;
};

const ALL_BRANCHES_VALUE = 'all';

/**
 * Branch picker for scoping list/report views. `value` is `null` to mean
 * "all branches accessible to the current user" — callers should already
 * have limited `branches` to what the user may see (see
 * DashboardMetricsService::accessibleBranchIds on the backend).
 */
export function BranchFilter({
    branches,
    value,
    onChange,
    allLabel = 'All branches',
    disabled,
}: {
    branches: BranchFilterOption[];
    value: number | null;
    onChange: (branchId: number | null) => void;
    allLabel?: string;
    disabled?: boolean;
}) {
    return (
        <Select
            value={value === null ? ALL_BRANCHES_VALUE : String(value)}
            onValueChange={(next) =>
                onChange(next === ALL_BRANCHES_VALUE ? null : Number(next))
            }
            disabled={disabled || branches.length === 0}
        >
            <SelectTrigger size="sm" aria-label="Filter by branch">
                <Building2 className="text-muted-foreground size-4" />
                <SelectValue placeholder={allLabel} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={ALL_BRANCHES_VALUE}>{allLabel}</SelectItem>
                {branches.map((branch) => (
                    <SelectItem key={branch.id} value={String(branch.id)}>
                        {branch.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
