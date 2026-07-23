import { Head, Link } from '@inertiajs/react';
import { BarChart } from '@mui/x-charts/BarChart';
import {
    CalendarClock,
    CircleDollarSign,
    RefreshCw,
    UserMinus,
    UserPlus,
    Users,
    WalletCards,
} from 'lucide-react';
import { useState } from 'react';
import { ActivityTimeline } from '@/components/shared/activity-timeline';
import { BranchFilter } from '@/components/shared/branch-filter';
import { CurrencyDisplay } from '@/components/shared/currency-display';
import { DataTable } from '@/components/shared/data-table';
import type { DataTableColumn } from '@/components/shared/data-table';
import { DateRangePicker } from '@/components/shared/date-range-picker';
import type { DateRange } from '@/components/shared/date-range-picker';
import { ErrorState } from '@/components/shared/error-state';
import { PageHeader } from '@/components/shared/page-header';
import { PageLoading } from '@/components/shared/page-loading';
import { ProtectedRoute } from '@/components/shared/protected-route';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { DashboardCard } from '@/modules/dashboard/components/dashboard-card';
import { SectionBoundary } from '@/modules/dashboard/components/section-boundary';
import { StatCard } from '@/modules/dashboard/components/stat-card';
import { useDashboardFilters } from '@/modules/dashboard/hooks/use-dashboard-filters';
import { useDashboardSummary } from '@/modules/dashboard/hooks/use-dashboard-summary';
import { dashboard } from '@/routes';
import { index as membersIndex } from '@/routes/members';

type RecentPayment = {
    id: string;
    member: string;
    plan: string;
    amount: number;
    status: string;
};

function defaultRange(): DateRange {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 30);

    return {
        from: from.toISOString().slice(0, 10),
        to: to.toISOString().slice(0, 10),
    };
}

function formatRelativeTime(iso: string | null): string {
    if (!iso) {
        return '';
    }

    const diffMs = Date.now() - new Date(iso).getTime();
    const minutes = Math.round(diffMs / 60000);

    if (minutes < 1) {
        return 'Just now';
    }

    if (minutes < 60) {
        return `${minutes} min ago`;
    }

    const hours = Math.round(minutes / 60);

    if (hours < 24) {
        return `${hours} hr${hours > 1 ? 's' : ''} ago`;
    }

    const days = Math.round(hours / 24);

    return `${days} day${days > 1 ? 's' : ''} ago`;
}

function DashboardContent() {
    const { filters } = useDashboardFilters();
    const [branchId, setBranchId] = useState<number | null>(null);
    const [range, setRange] = useState<DateRange>(defaultRange());

    const { summary, isLoading, error, refetch } = useDashboardSummary({
        branchId,
        dateFrom: range.from,
        dateTo: range.to,
    });

    const currency = summary?.meta.currency ?? 'USD';

    const paymentColumns: DataTableColumn<RecentPayment>[] = [
        {
            key: 'member',
            header: 'Member',
            cell: (row) => (
                <div>
                    <p className="font-medium">{row.member}</p>
                    <p className="text-muted-foreground text-xs">{row.id}</p>
                </div>
            ),
        },
        { key: 'plan', header: 'Plan', cell: (row) => row.plan },
        {
            key: 'amount',
            header: 'Amount',
            className: 'text-right',
            cell: (row) => (
                <CurrencyDisplay
                    amount={row.amount}
                    currency={currency}
                    className="font-medium"
                />
            ),
        },
        {
            key: 'status',
            header: 'Status',
            cell: (row) => (
                <StatusBadge status={row.status}>{row.status}</StatusBadge>
            ),
        },
    ];

    if (isLoading && !summary) {
        return <PageLoading />;
    }

    if (error && !summary) {
        return (
            <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 p-4 sm:p-6">
                <ErrorState description={error} onRetry={refetch} />
            </main>
        );
    }

    if (!summary) {
        return null;
    }

    return (
        <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 p-4 sm:p-6">
            <PageHeader
                title="Good afternoon, Admin"
                description="Here's what's happening across your gym today."
                actions={
                    <div className="flex flex-wrap items-center gap-2">
                        {isLoading && <Spinner />}
                        <BranchFilter
                            branches={filters?.branches ?? []}
                            value={branchId}
                            onChange={setBranchId}
                        />
                        <DateRangePicker value={range} onChange={setRange} />
                        <Button
                            variant="outline"
                            size="icon"
                            aria-label="Refresh dashboard"
                            onClick={refetch}
                        >
                            <RefreshCw />
                        </Button>
                    </div>
                }
            />

            <section
                className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6"
                aria-label="Gym overview"
            >
                {summary.members.active.status === 'available' ? (
                    <StatCard
                        label="Active members"
                        value={summary.members.active.data.count.toLocaleString()}
                        icon={Users}
                        href={membersIndex({ query: { status: 'active' } }).url}
                    />
                ) : (
                    <StatCard
                        label="Active members"
                        icon={Users}
                        state={summary.members.active.status}
                        message={summary.members.active.message}
                    />
                )}

                {summary.members.new.status === 'available' ? (
                    <StatCard
                        label="New members"
                        value={summary.members.new.data.count.toLocaleString()}
                        helper={`Joined ${summary.meta.dateFrom} – ${summary.meta.dateTo}`}
                        icon={UserPlus}
                        tone="emerald"
                        href={membersIndex().url}
                    />
                ) : (
                    <StatCard
                        label="New members"
                        icon={UserPlus}
                        tone="emerald"
                        state={summary.members.new.status}
                        message={summary.members.new.message}
                    />
                )}

                {summary.members.expiring.status === 'available' ? (
                    <StatCard
                        label="Expiring memberships"
                        value={summary.members.expiring.data.count.toLocaleString()}
                        icon={CalendarClock}
                        tone="amber"
                    />
                ) : (
                    <StatCard
                        label="Expiring memberships"
                        icon={CalendarClock}
                        tone="amber"
                        state={summary.members.expiring.status}
                        message={summary.members.expiring.message}
                    />
                )}

                {summary.members.expired.status === 'available' ? (
                    <StatCard
                        label="Expired members"
                        value={summary.members.expired.data.count.toLocaleString()}
                        icon={UserMinus}
                        tone="amber"
                    />
                ) : (
                    <StatCard
                        label="Expired members"
                        icon={UserMinus}
                        tone="amber"
                        state={summary.members.expired.status}
                        message={summary.members.expired.message}
                    />
                )}

                {summary.financials.revenue.status === 'available' ? (
                    <StatCard
                        label="Revenue"
                        value={new Intl.NumberFormat(undefined, {
                            style: 'currency',
                            currency,
                            maximumFractionDigits: 0,
                        }).format(summary.financials.revenue.data.amount)}
                        icon={CircleDollarSign}
                        tone="emerald"
                    />
                ) : (
                    <StatCard
                        label="Revenue"
                        icon={CircleDollarSign}
                        tone="emerald"
                        state={summary.financials.revenue.status}
                        message={summary.financials.revenue.message}
                    />
                )}

                {summary.financials.outstanding.status === 'available' ? (
                    <StatCard
                        label="Outstanding"
                        value={new Intl.NumberFormat(undefined, {
                            style: 'currency',
                            currency,
                            maximumFractionDigits: 0,
                        }).format(summary.financials.outstanding.data.amount)}
                        icon={WalletCards}
                        tone="amber"
                    />
                ) : (
                    <StatCard
                        label="Outstanding"
                        icon={WalletCards}
                        tone="amber"
                        state={summary.financials.outstanding.status}
                        message={summary.financials.outstanding.message}
                    />
                )}
            </section>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(22rem,1fr)]">
                <DashboardCard
                    title="Renewal summary"
                    description="Upcoming renewals across the selected range"
                >
                    <SectionBoundary section={summary.renewalSummary}>
                        {(data) => (
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-2xl font-bold">{data.renewed}</p>
                                    <p className="text-muted-foreground text-xs">Renewed</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{data.dueSoon}</p>
                                    <p className="text-muted-foreground text-xs">Due soon</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{data.overdue}</p>
                                    <p className="text-muted-foreground text-xs">Overdue</p>
                                </div>
                            </div>
                        )}
                    </SectionBoundary>
                </DashboardCard>

                <DashboardCard
                    title="Branch comparison"
                    description="Active members by branch"
                    action={
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/branches">View branches</Link>
                        </Button>
                    }
                >
                    <SectionBoundary section={summary.branchComparison}>
                        {(items) =>
                            items.length === 0 ? (
                                <p className="text-muted-foreground py-8 text-center text-sm">
                                    No branches in scope for this filter.
                                </p>
                            ) : (
                                <div className="h-64 w-full">
                                    <BarChart
                                        xAxis={[
                                            {
                                                scaleType: 'band',
                                                data: items.map((item) => item.branchName),
                                            },
                                        ]}
                                        series={[
                                            {
                                                data: items.map((item) => item.activeMembers),
                                                label: 'Active members',
                                                color: 'var(--chart-2)',
                                            },
                                        ]}
                                        yAxis={[{ width: 42 }]}
                                        grid={{ horizontal: true }}
                                        borderRadius={5}
                                        margin={{ top: 20, right: 10, bottom: 20, left: 0 }}
                                    />
                                </div>
                            )
                        }
                    </SectionBoundary>
                </DashboardCard>
            </section>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(22rem,1fr)]">
                <DashboardCard
                    title="Recent payments"
                    description="Latest payments received across branches in scope"
                >
                    <SectionBoundary section={summary.recentPayments}>
                        {(data) => (
                            <DataTable
                                columns={paymentColumns}
                                rows={data.items}
                                getRowKey={(row) => row.id}
                            />
                        )}
                    </SectionBoundary>
                </DashboardCard>

                <DashboardCard
                    title="Recent activity"
                    description="Latest operational events"
                >
                    <SectionBoundary section={summary.recentActivity}>
                        {(items) => (
                            <ActivityTimeline
                                items={items.map((item, index) => ({
                                    id: index,
                                    title: item.title,
                                    detail: item.detail,
                                    timeLabel: formatRelativeTime(item.occurredAt),
                                }))}
                            />
                        )}
                    </SectionBoundary>
                </DashboardCard>
            </section>
        </main>
    );
}

export default function DashboardPage() {
    return (
        <>
            <Head title="Dashboard" />
            <ProtectedRoute permission="dashboard.view">
                <DashboardContent />
            </ProtectedRoute>
        </>
    );
}

DashboardPage.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};
