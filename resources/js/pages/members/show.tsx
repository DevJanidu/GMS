import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    Building2,
    Cake,
    Calendar,
    FileIcon,
    Mail,
    MapPin,
    PencilIcon,
    Phone,
    PlusIcon,
    ShieldAlert,
    StickyNote,
    TrashIcon,
    User as UserIcon,
    UserCircle,
    VenusAndMars,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import MemberController from '@/actions/App/Http/Controllers/MemberController';
import MemberDocumentController from '@/actions/App/Http/Controllers/MemberDocumentController';
import MemberStatusController from '@/actions/App/Http/Controllers/MemberStatusController';
import MemberPortalInviteController from '@/actions/App/Modules/MemberPortal/Controllers/MemberPortalInviteController';
import MembershipController from '@/actions/App/Modules/Membership/Controllers/MembershipController';
import { DetailRow } from '@/components/detail-row';
import { CurrencyDisplay } from '@/components/shared/currency-display';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Money } from '@/modules/billing/components/money';
import { MemberStatusBadge } from '@/modules/members/components/member-status-badge';
import type {
    Member,
    MemberDocument,
    MemberPaymentHistory,
    MemberPortalAccountStatus,
    MemberStatus,
} from '@/modules/members/types';
import { MembershipStatusBadge } from '@/modules/memberships/components/membership-status-badge';
import type { Membership } from '@/modules/memberships/types';
import invoices from '@/routes/billing/invoices';
import receipts from '@/routes/billing/receipts';
import type { BreadcrumbItem } from '@/types';

const GENDER_LABELS: Record<string, string> = {
    male: 'Male',
    female: 'Female',
    other: 'Other',
    prefer_not_to_say: 'Prefer not to say',
};

export default function ShowMember({
    member,
    documents,
    membership,
    payment_history: paymentHistory,
}: {
    member: Member;
    documents: MemberDocument[];
    membership: Membership | null;
    payment_history: MemberPaymentHistory | null;
}) {
    const { gym } = usePage().props;
    const currency = gym?.currency ?? 'USD';

    function changeStatus(status: MemberStatus) {
        router.patch(
            MemberStatusController.update.url({ member: member.id }),
            { status },
            { preserveScroll: true },
        );
    }

    const [invitingToPortal, setInvitingToPortal] = useState(false);

    function inviteToPortal() {
        setInvitingToPortal(true);
        router.post(
            MemberPortalInviteController.store.url({ member: member.id }),
            {},
            {
                preserveScroll: true,
                onError: (errors) =>
                    toast.error(
                        errors.email ??
                            errors.portal_account ??
                            'Could not send the portal invitation.',
                    ),
                onFinish: () => setInvitingToPortal(false),
            },
        );
    }

    const uploadForm = useForm<{ name: string; file: File | null }>({
        name: '',
        file: null,
    });

    function uploadDocument(e: FormEvent) {
        e.preventDefault();
        uploadForm.post(
            MemberDocumentController.store.url({ member: member.id }),
            {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => uploadForm.reset(),
            },
        );
    }

    function deleteDocument(document: MemberDocument) {
        router.delete(
            MemberDocumentController.destroy.url({
                member: member.id,
                document: document.id,
            }),
            { preserveScroll: true },
        );
    }

    const emergencyContact = member.emergency_contact_name
        ? `${member.emergency_contact_name} (${member.emergency_contact_phone ?? '—'})`
        : null;

    return (
        <>
            <Head title={member.full_name} />

            <div className="flex flex-1 flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar className="size-16 border">
                            {member.photo_url && (
                                <AvatarImage
                                    src={member.photo_url}
                                    alt={member.full_name}
                                    className="object-cover"
                                />
                            )}
                            <AvatarFallback className="text-lg font-medium">
                                {member.first_name[0]}
                                {member.last_name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">
                                {member.full_name}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Member #{member.member_number}
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                                <MemberStatusBadge status={member.status} />
                                {member.branch && (
                                    <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                        <Building2 className="size-3" />
                                        {member.branch.name}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Select
                            value={member.status}
                            onValueChange={(value) =>
                                changeStatus(value as MemberStatus)
                            }
                        >
                            <SelectTrigger className="w-36">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">
                                    Inactive
                                </SelectItem>
                                <SelectItem value="archived">
                                    Archived
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" asChild>
                            <Link
                                href={MemberController.edit.url({
                                    member: member.id,
                                })}
                            >
                                <PencilIcon />
                                Edit
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Documents ({documents.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <form
                                    onSubmit={uploadDocument}
                                    className="flex flex-wrap items-end gap-3 rounded-xl border p-4"
                                >
                                    <div className="grid gap-2">
                                        <Label htmlFor="document_name">
                                            Document name
                                        </Label>
                                        <Input
                                            id="document_name"
                                            value={uploadForm.data.name}
                                            onChange={(e) =>
                                                uploadForm.setData(
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g. ID card"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="document_file">
                                            File
                                        </Label>
                                        <Input
                                            id="document_file"
                                            type="file"
                                            onChange={(e) =>
                                                uploadForm.setData(
                                                    'file',
                                                    e.target.files?.[0] ??
                                                        null,
                                                )
                                            }
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={uploadForm.processing}
                                    >
                                        Upload
                                    </Button>
                                </form>

                                <div className="divide-y rounded-xl border">
                                    {documents.length === 0 && (
                                        <p className="p-4 text-sm text-muted-foreground">
                                            No documents uploaded yet.
                                        </p>
                                    )}
                                    {documents.map((document) => (
                                        <div
                                            key={document.id}
                                            className="flex items-center justify-between gap-3 p-3"
                                        >
                                            <a
                                                href={document.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-2 text-sm hover:underline"
                                            >
                                                <FileIcon className="size-4 text-muted-foreground" />
                                                {document.name}
                                            </a>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    deleteDocument(document)
                                                }
                                            >
                                                <TrashIcon className="size-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Membership</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {membership ? (
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={MembershipController.show.url(
                                                        {
                                                            membership:
                                                                membership.id,
                                                        },
                                                    )}
                                                    className="font-medium hover:underline"
                                                >
                                                    {membership.plan_name}
                                                </Link>
                                                <MembershipStatusBadge
                                                    status={membership.status}
                                                    inGracePeriod={
                                                        membership.in_grace_period
                                                    }
                                                />
                                            </div>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                <CurrencyDisplay
                                                    amount={
                                                        membership.plan_price
                                                    }
                                                    currency={currency}
                                                />{' '}
                                                · Expires{' '}
                                                {membership.expires_on}
                                            </p>
                                        </div>
                                        <Button variant="outline" asChild>
                                            <Link
                                                href={MembershipController.show.url(
                                                    {
                                                        membership:
                                                            membership.id,
                                                    },
                                                )}
                                            >
                                                View membership
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-sm text-muted-foreground">
                                            No membership.
                                        </p>
                                        <Button asChild>
                                            <Link
                                                href={MembershipController.create.url(
                                                    {
                                                        query: {
                                                            member_id:
                                                                member.id,
                                                        },
                                                    },
                                                )}
                                            >
                                                <PlusIcon />
                                                Sell membership
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {paymentHistory && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Payment history</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-6 rounded-xl border p-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Payments made
                                            </p>
                                            <p className="text-lg font-semibold">
                                                {paymentHistory.summary.count}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Total paid
                                            </p>
                                            <p className="text-lg font-semibold">
                                                <Money
                                                    cents={
                                                        paymentHistory.summary
                                                            .total_paid_cents
                                                    }
                                                    currency={currency}
                                                />
                                            </p>
                                        </div>
                                    </div>

                                    <div className="divide-y rounded-xl border">
                                        {paymentHistory.payments.length ===
                                            0 && (
                                            <p className="p-4 text-sm text-muted-foreground">
                                                No payments recorded yet.
                                            </p>
                                        )}
                                        {paymentHistory.payments.map(
                                            (payment) => (
                                                <div
                                                    key={payment.id}
                                                    className="flex items-center justify-between gap-3 p-3 text-sm"
                                                >
                                                    <div>
                                                        <p className="font-medium">
                                                            <Money
                                                                cents={
                                                                    payment.amount_cents
                                                                }
                                                                currency={
                                                                    payment.currency
                                                                }
                                                            />{' '}
                                                            <span className="text-muted-foreground capitalize">
                                                                ·{' '}
                                                                {payment.method.replaceAll(
                                                                    '_',
                                                                    ' ',
                                                                )}
                                                            </span>
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(
                                                                payment.paid_at,
                                                            ).toLocaleString()}{' '}
                                                            ·{' '}
                                                            <Link
                                                                href={invoices.show.url(
                                                                    {
                                                                        invoiceId:
                                                                            payment.invoice_id,
                                                                    },
                                                                )}
                                                                className="hover:underline"
                                                            >
                                                                {
                                                                    payment.invoice_number
                                                                }
                                                            </Link>
                                                            {payment.receipt_id && (
                                                                <>
                                                                    {' · '}
                                                                    <Link
                                                                        href={receipts.show.url(
                                                                            {
                                                                                receiptId:
                                                                                    payment.receipt_id,
                                                                            },
                                                                        )}
                                                                        className="hover:underline"
                                                                    >
                                                                        Receipt
                                                                    </Link>
                                                                </>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserCircle className="size-4" />
                                    Portal access
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Status
                                    </span>
                                    <PortalAccountBadge
                                        status={member.portal_account?.status}
                                    />
                                </div>
                                {member.portal_account?.status ===
                                    'active' && (
                                    <p className="text-sm text-muted-foreground">
                                        This member can sign in to view their
                                        membership, attendance, receipts, and
                                        announcements.
                                    </p>
                                )}
                                {!member.email && (
                                    <p className="text-sm text-muted-foreground">
                                        Add an email address to invite this
                                        member to the portal.
                                    </p>
                                )}
                                {member.portal_account?.status !==
                                    'active' && (
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        disabled={
                                            !member.email || invitingToPortal
                                        }
                                        onClick={inviteToPortal}
                                    >
                                        {member.portal_account?.status ===
                                        'invited'
                                            ? 'Resend invitation'
                                            : 'Invite to portal'}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <DetailRow
                                    icon={<Mail className="size-4" />}
                                    label="Email"
                                    value={member.email}
                                />
                                <DetailRow
                                    icon={<Phone className="size-4" />}
                                    label="Phone"
                                    value={member.phone}
                                />
                                <DetailRow
                                    icon={<VenusAndMars className="size-4" />}
                                    label="Gender"
                                    value={
                                        member.gender
                                            ? (GENDER_LABELS[member.gender] ??
                                              member.gender)
                                            : null
                                    }
                                />
                                <DetailRow
                                    icon={<Cake className="size-4" />}
                                    label="Date of birth"
                                    value={member.date_of_birth}
                                />
                                <DetailRow
                                    icon={<MapPin className="size-4" />}
                                    label="Address"
                                    value={member.address}
                                />
                                <DetailRow
                                    icon={<Building2 className="size-4" />}
                                    label="Branch"
                                    value={member.branch?.name ?? null}
                                />
                                <DetailRow
                                    icon={<ShieldAlert className="size-4" />}
                                    label="Emergency contact"
                                    value={emergencyContact}
                                />
                                <DetailRow
                                    icon={<Calendar className="size-4" />}
                                    label="Joined"
                                    value={member.joined_at}
                                />
                                <DetailRow
                                    icon={<StickyNote className="size-4" />}
                                    label="Notes"
                                    value={member.notes}
                                />
                                <DetailRow
                                    icon={<UserIcon className="size-4" />}
                                    label="Registered"
                                    value={member.created_at}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

ShowMember.layout = (props: {
    member: Member;
}): { breadcrumbs: BreadcrumbItem[] } => ({
    breadcrumbs: [
        { title: 'Members', href: MemberController.index.url() },
        {
            title: props.member.full_name,
            href: MemberController.show.url({ member: props.member.id }),
        },
    ],
});

function PortalAccountBadge({
    status,
}: {
    status: MemberPortalAccountStatus | undefined;
}) {
    if (!status) {
        return <Badge variant="secondary">No account</Badge>;
    }

    if (status === 'active') {
        return <Badge>Active</Badge>;
    }

    if (status === 'invited') {
        return <Badge variant="outline">Invitation sent</Badge>;
    }

    return <Badge variant="destructive">Suspended</Badge>;
}
