export type InvoiceStatus =
    | 'open'
    | 'partially_paid'
    | 'paid'
    | 'partially_refunded'
    | 'refunded'
    | 'void';
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'online';

export type InvoiceItem = {
    id: number;
    description: string;
    item_type: string;
    quantity: number;
    unit_price_cents: number;
    line_total_cents: number;
};

export type Receipt = {
    id: number;
    public_id: string;
    receipt_number: string;
    invoice_id: number;
    payment_id: number;
    snapshot: {
        invoice_number: string;
        member: string | null;
        branch: string | null;
        currency: string;
        amount_cents: number;
        method: PaymentMethod;
        paid_at: string;
        balance_due_cents: number;
        items: InvoiceItem[];
    };
    generated_at: string;
};

export type Payment = {
    id: number;
    public_id: string;
    invoice_id: number;
    payment_number: string;
    amount_cents: number;
    method: PaymentMethod;
    reference: string | null;
    refunded_cents: number;
    paid_at: string;
    receipt?: Receipt;
};

export type Refund = {
    id: number;
    public_id: string;
    invoice_id: number;
    payment_id: number;
    refund_number: string;
    amount_cents: number;
    reason: string;
    refunded_at: string;
};

export type Invoice = {
    id: number;
    public_id: string;
    invoice_number: string;
    branch_id: number;
    member_id: number | null;
    membership_id: number | null;
    member?: { id: number; member_number: string; name: string } | null;
    branch?: { id: number; name: string };
    status: InvoiceStatus;
    currency: string;
    issued_on: string;
    due_on: string | null;
    subtotal_cents: number;
    discount_type: 'fixed' | 'percentage' | null;
    discount_value: number;
    discount_cents: number;
    tax_rate_basis_points: number;
    tax_cents: number;
    joining_fee_cents: number;
    grand_total_cents: number;
    amount_paid_cents: number;
    amount_refunded_cents: number;
    balance_due_cents: number;
    notes: string | null;
    items?: InvoiceItem[];
    payments?: Payment[];
    refunds?: Refund[];
};

export type CollectionSummary = {
    from: string;
    to: string;
    gross_cents: number;
    refunded_cents: number;
    net_cents: number;
    payment_count: number;
    refund_count: number;
    by_method: Record<
        PaymentMethod,
        { gross_cents: number; refunded_cents: number; net_cents: number }
    >;
    daily: { date: string; gross_cents: number; payment_count: number }[];
};
