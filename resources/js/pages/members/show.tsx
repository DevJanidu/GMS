import { Head, Link, router, useForm } from '@inertiajs/react';
import { FileIcon, PencilIcon, TrashIcon } from 'lucide-react';
import type { FormEvent } from 'react';
import MemberController from '@/actions/App/Http/Controllers/MemberController';
import MemberDocumentController from '@/actions/App/Http/Controllers/MemberDocumentController';
import MemberStatusController from '@/actions/App/Http/Controllers/MemberStatusController';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MemberStatusBadge } from '@/modules/members/components/member-status-badge';
import type {
    Member,
    MemberDocument,
    MemberStatus,
} from '@/modules/members/types';
import type { BreadcrumbItem } from '@/types';

export default function ShowMember({
    member,
    documents,
}: {
    member: Member;
    documents: MemberDocument[];
}) {
    function changeStatus(status: MemberStatus) {
        router.patch(
            MemberStatusController.update.url({ member: member.id }),
            { status },
            { preserveScroll: true },
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

    return (
        <>
            <Head title={member.full_name} />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {member.photo_url ? (
                            <img
                                src={member.photo_url}
                                alt={member.full_name}
                                className="size-16 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex size-16 items-center justify-center rounded-full bg-muted text-lg font-medium">
                                {member.first_name[0]}
                                {member.last_name[0]}
                            </div>
                        )}
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">
                                {member.full_name}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Member #{member.member_number}
                            </p>
                            <div className="mt-1">
                                <MemberStatusBadge status={member.status} />
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

                <Tabs defaultValue="overview">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="documents">
                            Documents ({documents.length})
                        </TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-4">
                        <dl className="grid gap-x-8 gap-y-4 rounded-xl border p-4 sm:grid-cols-2">
                            <Field label="Email" value={member.email} />
                            <Field label="Phone" value={member.phone} />
                            <Field label="Gender" value={member.gender} />
                            <Field
                                label="Date of birth"
                                value={member.date_of_birth}
                            />
                            <Field label="Address" value={member.address} />
                            <Field label="Branch" value={member.branch?.name} />
                            <Field
                                label="Emergency contact"
                                value={
                                    member.emergency_contact_name
                                        ? `${member.emergency_contact_name} (${member.emergency_contact_phone ?? '—'})`
                                        : null
                                }
                            />
                            <Field label="Joined" value={member.joined_at} />
                            <Field label="Notes" value={member.notes} />
                        </dl>
                    </TabsContent>

                    <TabsContent value="documents" className="mt-4 space-y-4">
                        <form
                            onSubmit={uploadDocument}
                            className="flex flex-wrap items-end gap-3 rounded-xl border p-4"
                        >
                            <div className="grid gap-2">
                                <label
                                    htmlFor="document_name"
                                    className="text-sm font-medium"
                                >
                                    Document name
                                </label>
                                <input
                                    id="document_name"
                                    className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
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
                                <label
                                    htmlFor="document_file"
                                    className="text-sm font-medium"
                                >
                                    File
                                </label>
                                <input
                                    id="document_file"
                                    type="file"
                                    onChange={(e) =>
                                        uploadForm.setData(
                                            'file',
                                            e.target.files?.[0] ?? null,
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
                                        onClick={() => deleteDocument(document)}
                                    >
                                        <TrashIcon className="size-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="history" className="mt-4">
                        <p className="rounded-xl border p-4 text-sm text-muted-foreground">
                            Membership and payment history will appear here once
                            the membership module is available.
                        </p>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}

function Field({ label, value }: { label: string; value?: string | null }) {
    return (
        <div>
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="text-sm">{value || '—'}</dd>
        </div>
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
