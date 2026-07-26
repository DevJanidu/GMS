import { apiClient } from '@/lib/api/client';
import type { ApiSuccess } from '@/lib/api/client';
import type {
    CollectionSummary,
    Invoice,
    Payment,
    PaymentMethod,
    Receipt,
    Refund,
} from '../types';

export type Page<T> = ApiSuccess<T[]> & {
    meta: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
    summary?: { invoice_count: number; outstanding_cents: number };
};

export type InvoiceInput = {
    branch_id: number;
    member_id?: number;
    membership_id?: number;
    currency: string;
    issued_on?: string;
    due_on?: string;
    discount_type?: 'fixed' | 'percentage';
    discount_value?: number;
    tax_rate_basis_points?: number;
    joining_fee_cents?: number;
    notes?: string;
    idempotency_key: string;
    items: {
        description: string;
        item_type?: string;
        quantity: number;
        unit_price_cents: number;
    }[];
};

export const billingApi = {
    invoices: (query = '') =>
        apiClient.get<Page<Invoice>>(`/billing/invoices${query}`),
    invoice: (id: number) =>
        apiClient.get<ApiSuccess<Invoice>>(`/billing/invoices/${id}`),
    createInvoice: (input: InvoiceInput) =>
        apiClient.post<ApiSuccess<Invoice>>('/billing/invoices', input),
    voidInvoice: (id: number, reason: string) =>
        apiClient.post<ApiSuccess<Invoice>>(`/billing/invoices/${id}/void`, {
            reason,
        }),
    recordPayment: (
        invoiceId: number,
        input: {
            amount_cents: number;
            method: PaymentMethod;
            reference?: string;
            installment_number?: number;
            idempotency_key: string;
        },
    ) =>
        apiClient.post<ApiSuccess<Payment>>(
            `/billing/invoices/${invoiceId}/payments`,
            input,
        ),
    splitPayment: (
        invoiceId: number,
        input: {
            idempotency_key: string;
            payments: {
                amount_cents: number;
                method: PaymentMethod;
                reference?: string;
            }[];
        },
    ) =>
        apiClient.post<ApiSuccess<Payment[]>>(
            `/billing/invoices/${invoiceId}/split-payments`,
            input,
        ),
    refund: (
        paymentId: number,
        input: {
            amount_cents: number;
            reason: string;
            idempotency_key: string;
        },
    ) =>
        apiClient.post<ApiSuccess<Refund>>(
            `/billing/payments/${paymentId}/refunds`,
            input,
        ),
    receipt: (id: number) =>
        apiClient.get<ApiSuccess<Receipt>>(`/billing/receipts/${id}`),
    outstanding: (query = '') =>
        apiClient.get<Page<Invoice>>(`/billing/outstanding-balances${query}`),
    collections: (from: string, to: string) =>
        apiClient.get<ApiSuccess<CollectionSummary>>(
            `/billing/collection-summary?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
        ),
    printReceiptUrl: (id: number) => `/api/v1/billing/receipts/${id}/print`,
};
