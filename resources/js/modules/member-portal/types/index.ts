export type PortalProfile = {
    member_number: string;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    date_of_birth: string | null;
    address: string | null;
    emergency_contact_name: string | null;
    emergency_contact_phone: string | null;
    photo_url: string | null;
    status: string;
    joined_at: string;
    branch: { name: string } | null;
};

export type PortalMembership = {
    id: number;
    status: 'pending' | 'active' | 'frozen' | 'suspended' | 'cancelled' | 'expired';
    status_label: string;
    plan_name: string;
    starts_on: string;
    expires_on: string;
    grace_ends_on: string;
    expired: boolean;
    in_grace_period: boolean;
    freeze_started_on: string | null;
    freeze_resumes_on: string | null;
    branch: { name: string } | null;
};

export type PortalDashboard = {
    profile: PortalProfile;
    membership: PortalMembership | null;
    payment_count: number;
    outstanding_balance_cents: number;
    attendance_count: number;
    unread_notification_count: number;
    attendance_trend: { date: string; visits: number }[];
};

export type PortalQrCard = {
    status: 'ready' | 'unavailable' | 'not_issued' | 'expired' | 'revoked';
    qr_payload: string | null;
    qr_image_data_url: string | null;
    credential_id: string | null;
    issued_at: string | null;
    expires_at: string | null;
    message: string;
};

export type PortalPayment = {
    id: string;
    payment_number: string;
    amount_cents: number;
    refunded_cents: number;
    currency: string;
    method: string;
    paid_at: string;
    receipt: { id: string; receipt_number: string } | null;
};

export type PortalReceipt = {
    id: string;
    receipt_number: string;
    generated_at: string;
    currency: string | null;
    amount_cents: number | null;
    method: string | null;
    paid_at: string | null;
    items: {
        description: string;
        quantity: number;
        unit_price_cents: number;
        line_total_cents: number;
    }[];
};

export type PortalAttendance = {
    id: number;
    status: string;
    source: string;
    checked_in_at: string;
    checked_out_at: string | null;
    branch: { name: string };
};

export type PortalNotification = {
    id: string;
    type: string;
    title: string;
    body: string;
    read_at: string | null;
    created_at: string;
};

export type ApiPage<T> = {
    success: true;
    data: T[];
    meta: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
};
