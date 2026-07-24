import { Head, Link } from '@inertiajs/react';
import { Bell, CalendarCheck, CreditCard, IdCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { memberPortalApi } from '../api/member-portal';
import { MembershipAlert } from '../components/membership-alert';
import { PortalMoney } from '../components/money';
import { PortalPageHeader } from '../components/portal-page-header';
import { PortalState } from '../components/portal-state';
import { useMemberPortalResource } from '../hooks/use-member-portal-resource';

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
                        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <Card>
                                <CardHeader className="flex-row items-center justify-between">
                                    <CardTitle className="text-sm">
                                        Membership
                                    </CardTitle>
                                    <IdCard className="size-5 text-emerald-600" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">
                                        {dashboard.membership?.status_label ??
                                            'None'}
                                    </p>
                                    <Link
                                        href="/member-portal/membership"
                                        className="text-xs text-emerald-700 hover:underline"
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
                                        className="text-xs text-emerald-700 hover:underline"
                                    >
                                        View notifications
                                    </Link>
                                </CardContent>
                            </Card>
                        </section>
                    </>
                )}
            </PortalState>
        </>
    );
}
