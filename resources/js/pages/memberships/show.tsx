import { Head, Link, router } from '@inertiajs/react';
import { RefreshCwIcon } from 'lucide-react';
import MembershipCancellationController from '@/actions/App/Modules/Membership/Controllers/MembershipCancellationController';
import MembershipController from '@/actions/App/Modules/Membership/Controllers/MembershipController';
import MembershipFreezeController from '@/actions/App/Modules/Membership/Controllers/MembershipFreezeController';
import MembershipReactivationController from '@/actions/App/Modules/Membership/Controllers/MembershipReactivationController';
import MembershipRenewalController from '@/actions/App/Modules/Membership/Controllers/MembershipRenewalController';
import MembershipResumeController from '@/actions/App/Modules/Membership/Controllers/MembershipResumeController';
import MembershipSuspensionController from '@/actions/App/Modules/Membership/Controllers/MembershipSuspensionController';
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { MembershipStatusBadge } from '@/modules/memberships/components/membership-status-badge';
import { ReasonDialog } from '@/modules/memberships/components/reason-dialog';
import type { Membership } from '@/modules/memberships/types';
import type { BreadcrumbItem } from '@/types';

export default function ShowMembership({
    membership,
}: {
    membership: Membership;
}) {
    function resume() {
        router.patch(
            MembershipResumeController.update.url({
                membership: membership.id,
            }),
            {},
            { preserveScroll: true },
        );
    }

    function reactivate() {
        router.patch(
            MembershipReactivationController.update.url({
                membership: membership.id,
            }),
            {},
            { preserveScroll: true },
        );
    }

    return (
        <>
            <Head title={`${membership.member?.full_name ?? 'Membership'}`} />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-semibold tracking-tight">
                                {membership.member?.full_name}
                            </h1>
                            <MembershipStatusBadge
                                status={membership.status}
                                inGracePeriod={membership.in_grace_period}
                            />
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {membership.plan_name} · {membership.branch?.name}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {membership.status === 'active' &&
                            !membership.has_forward_renewal && (
                                <Button asChild variant="outline">
                                    <Link
                                        href={MembershipRenewalController.create.url(
                                            { membership: membership.id },
                                        )}
                                    >
                                        <RefreshCwIcon />
                                        Renew
                                    </Link>
                                </Button>
                            )}

                        {membership.status === 'active' && (
                            <>
                                <ReasonDialog
                                    trigger={
                                        <Button variant="outline">
                                            Freeze
                                        </Button>
                                    }
                                    title="Freeze membership"
                                    description="Pause this membership. The paused days will be added back onto the expiry date when resumed."
                                    confirmLabel="Freeze"
                                    action={MembershipFreezeController.update.url(
                                        { membership: membership.id },
                                    )}
                                    reasonRequired={false}
                                />
                                <ReasonDialog
                                    trigger={
                                        <Button variant="outline">
                                            Suspend
                                        </Button>
                                    }
                                    title="Suspend membership"
                                    description="Block access without extending the expiry date."
                                    confirmLabel="Suspend"
                                    destructive
                                    action={MembershipSuspensionController.update.url(
                                        { membership: membership.id },
                                    )}
                                />
                            </>
                        )}

                        {membership.status === 'frozen' && (
                            <ConfirmationDialog
                                trigger={
                                    <Button variant="outline">Resume</Button>
                                }
                                title="Resume membership"
                                description="Resume this membership now. Paused days will be credited back to the expiry date."
                                confirmLabel="Resume"
                                onConfirm={resume}
                            />
                        )}

                        {(membership.status === 'frozen' ||
                            membership.status === 'suspended') && (
                            <ConfirmationDialog
                                trigger={
                                    <Button variant="outline">
                                        Reactivate
                                    </Button>
                                }
                                title="Reactivate membership"
                                description="Restore this membership to active status."
                                confirmLabel="Reactivate"
                                onConfirm={reactivate}
                            />
                        )}

                        {!['cancelled', 'expired'].includes(
                            membership.status,
                        ) && (
                            <ReasonDialog
                                trigger={
                                    <Button variant="destructive">
                                        Cancel
                                    </Button>
                                }
                                title="Cancel membership"
                                description="This ends the membership permanently. It cannot be undone or reactivated."
                                confirmLabel="Cancel membership"
                                destructive
                                action={MembershipCancellationController.update.url(
                                    { membership: membership.id },
                                )}
                            />
                        )}
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-4">
                    <Stat label="Starts" value={membership.starts_on} />
                    <Stat label="Expires" value={membership.expires_on} />
                    <Stat
                        label="Grace ends"
                        value={membership.grace_ends_on}
                    />
                    <Stat
                        label="Price"
                        value={`$${membership.plan_price.toFixed(2)}`}
                    />
                </div>

                {membership.previous_membership && (
                    <p className="text-sm text-muted-foreground">
                        Renewed from{' '}
                        <Link
                            href={MembershipController.show.url({
                                membership: membership.previous_membership.id,
                            })}
                            className="underline"
                        >
                            a previous membership
                        </Link>{' '}
                        that expired {membership.previous_membership.expires_on}.
                    </p>
                )}

                {membership.renewal && (
                    <p className="text-sm text-muted-foreground">
                        Already renewed into{' '}
                        <Link
                            href={MembershipController.show.url({
                                membership: membership.renewal.id,
                            })}
                            className="underline"
                        >
                            a new membership
                        </Link>{' '}
                        starting {membership.renewal.starts_on}.
                    </p>
                )}

                <div className="rounded-xl border">
                    <div className="p-4 pb-0">
                        <h2 className="text-sm font-medium">History</h2>
                    </div>
                    <ul className="divide-y">
                        {(membership.events ?? []).map((event) => (
                            <li
                                key={event.id}
                                className="flex items-center justify-between px-4 py-3 text-sm"
                            >
                                <div>
                                    <span className="font-medium">
                                        {event.type_label}
                                    </span>
                                    {event.actor && (
                                        <span className="text-muted-foreground">
                                            {' '}
                                            by {event.actor.name}
                                        </span>
                                    )}
                                </div>
                                <span className="text-muted-foreground">
                                    {new Date(
                                        event.occurred_at,
                                    ).toLocaleString()}
                                </span>
                            </li>
                        ))}
                        {(membership.events ?? []).length === 0 && (
                            <li className="px-4 py-6 text-center text-sm text-muted-foreground">
                                No history yet.
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-lg font-semibold">{value}</p>
        </div>
    );
}

ShowMembership.layout = (props: {
    membership: Membership;
}): { breadcrumbs: BreadcrumbItem[] } => ({
    breadcrumbs: [
        { title: 'Memberships', href: MembershipController.index.url() },
        {
            title: props.membership.member?.full_name ?? 'Membership',
            href: MembershipController.show.url({
                membership: props.membership.id,
            }),
        },
    ],
});
