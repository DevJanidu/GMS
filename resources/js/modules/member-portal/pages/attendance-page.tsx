import { Head } from '@inertiajs/react';
import { DataTable } from '@/components/shared/data-table';
import type { DataTableColumn } from '@/components/shared/data-table';
import { EmptyState } from '@/components/shared/empty-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { memberPortalApi } from '../api/member-portal';
import { PortalPageHeader } from '../components/portal-page-header';
import { PortalPagination } from '../components/portal-pagination';
import { PortalState } from '../components/portal-state';
import { useMemberPortalPage } from '../hooks/use-member-portal-page';
import type { PortalAttendance } from '../types';

const columns: DataTableColumn<PortalAttendance>[] = [
    {
        key: 'date',
        header: 'Check-in',
        cell: (record) => new Date(record.checked_in_at).toLocaleString(),
    },
    {
        key: 'branch',
        header: 'Branch',
        cell: (record) => record.branch.name,
    },
    {
        key: 'source',
        header: 'Source',
        cell: (record) => record.source.replaceAll('_', ' '),
    },
    {
        key: 'status',
        header: 'Status',
        cell: (record) => (
            <StatusBadge status={record.status}>
                {record.status.replaceAll('_', ' ')}
            </StatusBadge>
        ),
    },
    {
        key: 'checkout',
        header: 'Check-out',
        cell: (record) =>
            record.checked_out_at
                ? new Date(record.checked_out_at).toLocaleString()
                : '—',
    },
];

export default function MemberPortalAttendancePage() {
    const resource = useMemberPortalPage(memberPortalApi.attendance);

    return (
        <>
            <Head title="Attendance history" />
            <PortalPageHeader
                title="Attendance history"
                description="Review your recorded gym visits and check-in status."
            />
            <PortalState {...resource}>
                {(records) => (
                    <div className="grid gap-4">
                        <DataTable
                            columns={columns}
                            rows={records}
                            getRowKey={(record) => record.id}
                            empty={
                                <EmptyState
                                    title="No visits recorded"
                                    description="Your check-ins will appear here."
                                />
                            }
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
