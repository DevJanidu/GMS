import { Head } from '@inertiajs/react';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import {
    Activity,
    AlertTriangle,
    CalendarClock,
    CircleDollarSign,
    CreditCard,
    DoorOpen,
    MoreHorizontal,
    UserPlus,
    Users,
    WalletCards,
} from 'lucide-react';
import { DataTable } from '@/components/shared/data-table';
import type { DataTableColumn } from '@/components/shared/data-table';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { DashboardCard } from '@/modules/dashboard/components/dashboard-card';
import { StatCard } from '@/modules/dashboard/components/stat-card';
import { dashboard } from '@/routes';

type Payment = {
    id: string;
    member: string;
    plan: string;
    amount: string;
    status: 'Paid' | 'Pending';
};

const payments: Payment[] = [
    {
        id: 'INV-1048',
        member: 'Nethmi Perera',
        plan: 'Annual Pro',
        amount: 'LKR 48,000',
        status: 'Paid',
    },
    {
        id: 'INV-1047',
        member: 'Dilan Fernando',
        plan: 'Monthly Plus',
        amount: 'LKR 6,500',
        status: 'Paid',
    },
    {
        id: 'INV-1046',
        member: 'Amaya Silva',
        plan: 'Quarterly',
        amount: 'LKR 16,500',
        status: 'Pending',
    },
    {
        id: 'INV-1045',
        member: 'Ravindu Jayasekara',
        plan: 'Monthly Plus',
        amount: 'LKR 6,500',
        status: 'Paid',
    },
];

const paymentColumns: DataTableColumn<Payment>[] = [
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
        cell: (row) => <span className="font-medium">{row.amount}</span>,
    },
    {
        key: 'status',
        header: 'Status',
        cell: (row) => (
            <StatusBadge tone={row.status === 'Paid' ? 'success' : 'warning'}>
                {row.status}
            </StatusBadge>
        ),
    },
];

const activityItems = [
    {
        title: 'New member joined',
        detail: 'Nethmi Perera · Annual Pro',
        time: '8 min ago',
        icon: UserPlus,
    },
    {
        title: 'Payment received',
        detail: 'LKR 6,500 · Dilan Fernando',
        time: '24 min ago',
        icon: CreditCard,
    },
    {
        title: 'Membership renewed',
        detail: 'Ravindu Jayasekara · Monthly Plus',
        time: '1 hr ago',
        icon: CalendarClock,
    },
    {
        title: 'Member checked in',
        detail: 'Amaya Silva · Colombo Central',
        time: '2 hrs ago',
        icon: DoorOpen,
    },
];

export default function DashboardPage() {
    return (
        <>
            <Head title="Dashboard" />
            <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 p-4 sm:p-6">
                <PageHeader
                    title="Good afternoon, Admin"
                    description="Here’s what’s happening across Pulse Fitness today."
                    actions={
                        <Button variant="outline" size="sm">
                            <CalendarClock />
                            Jul 1 – Jul 23
                        </Button>
                    }
                />

                <section
                    className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6"
                    aria-label="Gym overview"
                >
                    <StatCard
                        label="Active members"
                        value="1,248"
                        helper="+8.2% from last month"
                        trend="up"
                        icon={Users}
                    />
                    <StatCard
                        label="New members"
                        value="86"
                        helper="18 joined this week"
                        trend="up"
                        icon={UserPlus}
                        tone="emerald"
                    />
                    <StatCard
                        label="Today's attendance"
                        value="312"
                        helper="62% of daily average"
                        icon={Activity}
                        tone="blue"
                    />
                    <StatCard
                        label="Expiring soon"
                        value="29"
                        helper="Within the next 7 days"
                        icon={CalendarClock}
                        tone="amber"
                    />
                    <StatCard
                        label="Monthly revenue"
                        value="LKR 2.4M"
                        helper="+12.4% from last month"
                        trend="up"
                        icon={CircleDollarSign}
                        tone="emerald"
                    />
                    <StatCard
                        label="Outstanding"
                        value="LKR 184K"
                        helper="Across 34 invoices"
                        trend="down"
                        icon={WalletCards}
                        tone="amber"
                    />
                </section>

                <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(22rem,1fr)]">
                    <DashboardCard
                        title="Revenue overview"
                        description="Monthly collections for the last six months"
                        action={<StatusBadge tone="success">+12.4%</StatusBadge>}
                    >
                        <div className="h-72 w-full">
                            <LineChart
                                xAxis={[
                                    {
                                        scaleType: 'point',
                                        data: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                                    },
                                ]}
                                series={[
                                    {
                                        data: [1.58, 1.76, 1.69, 2.08, 2.14, 2.4],
                                        label: 'Revenue (LKR millions)',
                                        color: 'var(--chart-1)',
                                        area: true,
                                        showMark: false,
                                    },
                                ]}
                                yAxis={[{ width: 42 }]}
                                grid={{ horizontal: true }}
                                margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
                            />
                        </div>
                    </DashboardCard>

                    <DashboardCard
                        title="Branch comparison"
                        description="Active members by location"
                    >
                        <div className="h-72 w-full">
                            <BarChart
                                xAxis={[
                                    {
                                        scaleType: 'band',
                                        data: ['Colombo', 'Kandy', 'Galle', 'Negombo'],
                                    },
                                ]}
                                series={[
                                    {
                                        data: [486, 312, 254, 196],
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
                    </DashboardCard>
                </section>

                <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(22rem,1fr)]">
                    <DashboardCard
                        title="Recent payments"
                        description="Latest payments received across all branches"
                        action={
                            <Button variant="ghost" size="sm">
                                View all
                            </Button>
                        }
                    >
                        <DataTable
                            columns={paymentColumns}
                            rows={payments}
                            getRowKey={(row) => row.id}
                        />
                    </DashboardCard>

                    <DashboardCard
                        title="Recent activity"
                        description="Latest operational events"
                        action={
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Activity options"
                            >
                                <MoreHorizontal />
                            </Button>
                        }
                    >
                        <div className="space-y-5">
                            {activityItems.map((item) => (
                                <div
                                    key={`${item.title}-${item.time}`}
                                    className="flex gap-3"
                                >
                                    <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-full">
                                        <item.icon className="size-4 text-primary" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium">
                                            {item.title}
                                        </p>
                                        <p className="text-muted-foreground truncate text-xs">
                                            {item.detail}
                                        </p>
                                    </div>
                                    <span className="text-muted-foreground shrink-0 text-[11px]">
                                        {item.time}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </DashboardCard>
                </section>

                <DashboardCard
                    title="System alerts"
                    description="Items that may need your attention"
                >
                    <div className="grid gap-3 md:grid-cols-3">
                        <AlertItem
                            title="29 memberships expire soon"
                            detail="Send reminders before the next renewal window."
                            tone="warning"
                        />
                        <AlertItem
                            title="34 outstanding invoices"
                            detail="LKR 184,000 is currently pending collection."
                            tone="danger"
                        />
                        <AlertItem
                            title="All branches operational"
                            detail="No service interruptions reported today."
                            tone="success"
                        />
                    </div>
                </DashboardCard>
            </main>
        </>
    );
}

function AlertItem({
    title,
    detail,
    tone,
}: {
    title: string;
    detail: string;
    tone: 'success' | 'warning' | 'danger';
}) {
    return (
        <div className="bg-muted/35 flex gap-3 rounded-xl border p-4">
            <AlertTriangle
                className={
                    tone === 'success'
                        ? 'size-5 shrink-0 text-emerald-500'
                        : tone === 'warning'
                          ? 'size-5 shrink-0 text-orange-500'
                          : 'size-5 shrink-0 text-red-500'
                }
            />
            <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                    {detail}
                </p>
            </div>
        </div>
    );
}

DashboardPage.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};
