export type MemberStatus = 'active' | 'inactive' | 'archived';

export type MemberPortalAccountStatus = 'invited' | 'active' | 'suspended';

export type MemberPortalAccountSummary = {
    status: MemberPortalAccountStatus;
    invited_at: string | null;
    activated_at: string | null;
    last_login_at: string | null;
};

export type Member = {
    id: number;
    member_number: string;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    gender: string | null;
    date_of_birth: string | null;
    address: string | null;
    emergency_contact_name: string | null;
    emergency_contact_phone: string | null;
    photo_url: string | null;
    status: MemberStatus;
    notes: string | null;
    joined_at: string | null;
    archived_at: string | null;
    branch: { id: number; name: string } | null;
    portal_account: MemberPortalAccountSummary | null;
    created_at: string;
};

export type MemberDocument = {
    id: number;
    name: string;
    url: string;
    mime_type: string | null;
    size: number | null;
    uploaded_by: string | null;
    created_at: string;
};

export type BranchOption = {
    id: number;
    name: string;
};

export type MemberPayment = {
    id: number;
    payment_number: string;
    amount_cents: number;
    method: string;
    paid_at: string;
    currency: string;
    invoice_id: number;
    invoice_number: string;
    receipt_id: number | null;
};

export type MemberPaymentHistory = {
    summary: {
        count: number;
        total_paid_cents: number;
    };
    payments: MemberPayment[];
};
