export type MembershipStatus =
    | 'pending'
    | 'active'
    | 'frozen'
    | 'suspended'
    | 'cancelled'
    | 'expired';

export type MembershipEvent = {
    id: number;
    type: string;
    type_label: string;
    from_status: string | null;
    to_status: string | null;
    occurred_at: string;
    actor: { id: number; name: string } | null;
    metadata: Record<string, unknown>;
};

export type Membership = {
    id: number;
    status: MembershipStatus;
    status_label: string;
    plan_id: number | null;
    plan_name: string;
    plan_price: number;
    plan_joining_fee: number;
    plan_duration_value: number;
    plan_duration_unit: string;
    starts_on: string;
    expires_on: string;
    grace_days: number;
    grace_ends_on: string;
    in_grace_period: boolean;
    has_forward_renewal: boolean;
    previous_membership_id: number | null;
    invoice_id: number | null;
    freeze_started_on: string | null;
    freeze_resumes_on: string | null;
    suspended_at: string | null;
    suspension_reason: string | null;
    cancelled_at: string | null;
    cancellation_reason: string | null;
    expired_at: string | null;
    notes: string | null;
    member?: {
        id: number;
        member_number: string;
        full_name: string;
        email: string | null;
        phone: string | null;
    };
    branch?: { id: number; name: string };
    plan?: { id: number; name: string; status: string } | null;
    previous_membership?: { id: number; expires_on: string } | null;
    renewal?: { id: number; starts_on: string } | null;
    events?: MembershipEvent[];
    sold_at: string | null;
    created_at: string | null;
};

export type MemberOption = {
    id: number;
    member_number: string;
    full_name: string;
    email: string | null;
};

export type PlanOption = {
    id: number;
    name: string;
    price: number;
    joining_fee: number;
    duration_value: number;
    duration_unit: string;
};

export type BranchOption = {
    id: number;
    name: string;
};
