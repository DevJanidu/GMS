export type PlanStatus = 'active' | 'inactive';
export type DurationUnit = 'days' | 'weeks' | 'months' | 'years';

export type PlanPriceHistoryEntry = {
    id: number;
    price: number;
    joining_fee: number;
    effective_from: string;
    effective_until: string | null;
};

export type Plan = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    joining_fee: number;
    duration_value: number;
    duration_unit: DurationUnit;
    available_at_all_branches: boolean;
    status: PlanStatus;
    cloned_from_id: number | null;
    branches?: { id: number; name: string }[];
    price_history?: PlanPriceHistoryEntry[];
    created_at: string;
};

export type BranchOption = {
    id: number;
    name: string;
};
