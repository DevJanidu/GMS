import { Head, Link } from '@inertiajs/react';
import { DataTable } from '@/components/shared/data-table';
import type { DataTableColumn } from '@/components/shared/data-table';
import { EmptyState } from '@/components/shared/empty-state';
import { memberPortalApi } from '../api/member-portal';
import { PortalMoney } from '../components/money';
import { PortalPageHeader } from '../components/portal-page-header';
import { PortalPagination } from '../components/portal-pagination';
import { PortalRowCard } from '../components/portal-row-card';
import { PortalState } from '../components/portal-state';
import { useMemberPortalPage } from '../hooks/use-member-portal-page';
import type { PortalPayment } from '../types';

const columns: DataTableColumn<PortalPayment>[] = [
    {
        key: 'number',
        header: 'Payment',
        cell: (payment) => payment.payment_number,
    },
    {
        key: 'date',
        header: 'Paid',
        cell: (payment) => new Date(payment.paid_at).toLocaleDateString(),
    },
    {
        key: 'method',
        header: 'Method',
        cell: (payment) => payment.method.replaceAll('_', ' '),
    },
    {
        key: 'amount',
        header: 'Amount',
        className: 'text-right',
        cell: (payment) => (
            <PortalMoney
                cents={payment.amount_cents}
                currency={payment.currency}
            />
        ),
    },
    {
        key: 'receipt',
        header: 'Receipt',
        cell: (payment) =>
            payment.receipt ? (
                <Link
                    href="/member-portal/receipts"
                    className="text-portal-accent hover:underline"
                >
                    {payment.receipt.receipt_number}
                </Link>
            ) : (
                '—'
            ),
    },
];

export default function MemberPortalPaymentsPage() {
    const resource = useMemberPortalPage(memberPortalApi.payments);

    return (
        <>
            <Head title="Payment history" />
            <PortalPageHeader
                title="Payment history"
                description="A complete view of payments recorded against your account."
            />
            <PortalState {...resource}>
                {(payments) => (
                    <div className="grid gap-4">
                        <DataTable
                            columns={columns}
                            rows={payments}
                            getRowKey={(payment) => payment.id}
                            empty={
                                <EmptyState
                                    title="No payments yet"
                                    description="Payments will appear here after they are recorded."
                                />
                            }
                            renderMobileRow={(payment) => (
                                <PortalRowCard
                                    title={payment.payment_number}
                                    subtitle={new Date(
                                        payment.paid_at,
                                    ).toLocaleDateString()}
                                    trailing={
                                        <PortalMoney
                                            cents={payment.amount_cents}
                                            currency={payment.currency}
                                        />
                                    }
                                    meta={
                                        <>
                                            <span className="capitalize">
                                                {payment.method.replaceAll(
                                                    '_',
                                                    ' ',
                                                )}
                                            </span>
                                            {payment.receipt && (
                                                <Link
                                                    href="/member-portal/receipts"
                                                    className="text-portal-accent hover:underline"
                                                >
                                                    {
                                                        payment.receipt
                                                            .receipt_number
                                                    }
                                                </Link>
                                            )}
                                        </>
                                    }
                                />
                            )}
                        />
                        {resource.meta && (
                            <PortalPagination
                                meta={resource.meta}
                                onPageChange={resource.setPage}
                            />
                        )}
                    </div>
                )}
            </PortalState>
        </>
    );
}
