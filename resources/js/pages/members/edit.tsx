import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import MemberController from '@/actions/App/Http/Controllers/MemberController';
import { Button } from '@/components/ui/button';
import { MemberForm } from '@/modules/members/components/member-form';
import type { MemberFormData } from '@/modules/members/components/member-form';
import type { BranchOption, Member } from '@/modules/members/types';
import type { BreadcrumbItem } from '@/types';

export default function EditMember({
    member,
    branches,
}: {
    member: Member;
    branches: BranchOption[];
}) {
    const form = useForm<MemberFormData>({
        first_name: member.first_name,
        last_name: member.last_name,
        email: member.email ?? '',
        phone: member.phone ?? '',
        gender: member.gender ?? '',
        date_of_birth: member.date_of_birth ?? '',
        address: member.address ?? '',
        emergency_contact_name: member.emergency_contact_name ?? '',
        emergency_contact_phone: member.emergency_contact_phone ?? '',
        branch_id: member.branch ? String(member.branch.id) : '',
        notes: member.notes ?? '',
        joined_at: member.joined_at ?? '',
        photo: null,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        form.put(MemberController.update.url({ member: member.id }), {
            forceFormData: true,
        });
    }

    return (
        <>
            <Head title={`Edit ${member.full_name}`} />

            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">
                        Edit {member.full_name}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Member #{member.member_number}
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <MemberForm form={form} branches={branches} />

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={form.processing}>
                            Save changes
                        </Button>
                        <Button variant="outline" asChild>
                            <Link
                                href={MemberController.show.url({
                                    member: member.id,
                                })}
                            >
                                Cancel
                            </Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

EditMember.layout = (props: {
    member: Member;
}): { breadcrumbs: BreadcrumbItem[] } => ({
    breadcrumbs: [
        { title: 'Members', href: MemberController.index.url() },
        {
            title: props.member.full_name,
            href: MemberController.show.url({ member: props.member.id }),
        },
        {
            title: 'Edit',
            href: MemberController.edit.url({ member: props.member.id }),
        },
    ],
});
