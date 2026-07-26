import { Head } from '@inertiajs/react';
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
import type { PortalReceipt } from '../types';

const columns: DataTableColumn<PortalReceipt>[] = [
    {
        key: 'number',
        header: 'Receipt',
        cell: (receipt) => receipt.receipt_number,
    },
    {
        key: 'date',
        header: 'Generated',
        cell: (receipt) => new Date(receipt.generated_at).toLocaleDateString(),
    },
    {
        key: 'method',
        header: 'Method',
        cell: (receipt) => receipt.method?.replaceAll('_', ' ') ?? '—',
    },
    {
        key: 'amount',
        header: 'Amount',
        className: 'text-right',
        cell: (receipt) =>
            receipt.amount_cents === null ? (
                '—'
            ) : (
                <PortalMoney
                    cents={receipt.amount_cents}
                    currency={receipt.currency}
                />
            ),
    },
];

export default function MemberPortalReceiptsPage() {
    const resource = useMemberPortalPage(memberPortalApi.receipts);

    return (
        <>
            <Head title="Receipts" />
            <PortalPageHeader
                title="Receipts"
                description="Find receipts generated for your completed payments."
            />
            <PortalState {...resource}>
                {(receipts) => (
                    <div className="grid gap-4">
                        <DataTable
                            columns={columns}
                            rows={receipts}
                            getRowKey={(receipt) => receipt.id}
                            empty={
                                <EmptyState
                                    title="No receipts yet"
                                    description="Receipts will appear here after eligible payments."
                                />
                            }
                            renderMobileRow={(receipt) => (
                                <PortalRowCard
                                    title={receipt.receipt_number}
                                    subtitle={new Date(
                                        receipt.generated_at,
                                    ).toLocaleDateString()}
                                    trailing={
                                        receipt.amount_cents === null ? (
                                            '—'
                                        ) : (
                                            <PortalMoney
                                                cents={receipt.amount_cents}
                                                currency={receipt.currency}
                                            />
                                        )
                                    }
                                    meta={
                                        <span className="capitalize">
                                            {receipt.method?.replaceAll(
                                                '_',
                                                ' ',
                                            ) ?? '—'}
                                        </span>
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
