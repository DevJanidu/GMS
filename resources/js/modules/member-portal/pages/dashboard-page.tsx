import { Head, Link } from '@inertiajs/react';
import { Bell, CalendarCheck, CreditCard, IdCard } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { memberPortalApi } from '../api/member-portal';
import { MembershipAlert } from '../components/membership-alert';
import { PortalMoney } from '../components/money';
import { PortalPageHeader } from '../components/portal-page-header';
import { PortalState } from '../components/portal-state';
import { useMemberPortalResource } from '../hooks/use-member-portal-resource';

const visitsChartConfig = {
    visits: {
        label: 'Visits',
        color: 'var(--portal-accent)',
    },
} satisfies ChartConfig;

export default function MemberPortalDashboardPage() {
    const resource = useMemberPortalResource(memberPortalApi.dashboard);

    return (
        <>
            <Head title="Member dashboard" />
            <PortalPageHeader
                title="Welcome back"
                description="Your membership, visits, payments and updates in one secure place."
            />
            <PortalState {...resource}>
                {(dashboard) => (
                    <>
                        <MembershipAlert membership={dashboard.membership} />
                        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex-row items-center justify-between">
                                    <CardTitle className="text-sm">
                                        Membership
                                    </CardTitle>
                                    <IdCard className="size-5 text-portal-accent" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">
                                        {dashboard.membership?.status_label ??
                                            'None'}
                                    </p>
                                    <Link
                                        href="/member-portal/membership"
                                        className="text-xs text-portal-accent hover:underline"
                                    >
                                        View membership
                                    </Link>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex-row items-center justify-between">
                                    <CardTitle className="text-sm">
                                        Visits
                                    </CardTitle>
                                    <CalendarCheck className="size-5 text-blue-600" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">
                                        {dashboard.attendance_count}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Recorded check-ins
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex-row items-center justify-between">
                                    <CardTitle className="text-sm">
                                        Outstanding
                                    </CardTitle>
                                    <CreditCard className="size-5 text-amber-600" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">
                                        <PortalMoney
                                            cents={
                                                dashboard.outstanding_balance_cents
                                            }
                                        />
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Across your invoices
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex-row items-center justify-between">
                                    <CardTitle className="text-sm">
                                        Unread
                                    </CardTitle>
                                    <Bell className="size-5 text-violet-600" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">
                                        {dashboard.unread_notification_count}
                                    </p>
                                    <Link
                                        href="/member-portal/notifications"
                                        className="text-xs text-portal-accent hover:underline"
                                    >
                                        View notifications
                                    </Link>
                                </CardContent>
                            </Card>
                        </section>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">
                                    Visits, last 14 days
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={visitsChartConfig}
                                    className="aspect-auto h-40 w-full sm:h-48"
                                >
                                    <AreaChart
                                        accessibilityLayer
                                        data={dashboard.attendance_trend}
                                        margin={{
                                            top: 8,
                                            right: 8,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            minTickGap={24}
                                            tickFormatter={(value: string) =>
                                                new Date(
                                                    value,
                                                ).toLocaleDateString(
                                                    undefined,
                                                    {
                                                        month: 'short',
                                                        day: 'numeric',
                                                    },
                                                )
                                            }
                                        />
                                        <ChartTooltip
                                            cursor={false}
                                            content={
                                                <ChartTooltipContent
                                                    indicator="line"
                                                    labelFormatter={(value) =>
                                                        new Date(
                                                            String(value),
                                                        ).toLocaleDateString(
                                                            undefined,
                                                            {
                                                                weekday:
                                                                    'short',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            },
                                                        )
                                                    }
                                                />
                                            }
                                        />
                                        <Area
                                            dataKey="visits"
                                            type="monotone"
                                            fill="var(--color-visits)"
                                            fillOpacity={0.2}
                                            stroke="var(--color-visits)"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </>
                )}
            </PortalState>
        </>
    );
}
