import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import MemberController from '@/actions/App/Http/Controllers/MemberController';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MemberForm } from '@/modules/members/components/member-form';
import type { MemberFormData } from '@/modules/members/components/member-form';
import { MemberLivePreview } from '@/modules/members/components/member-live-preview';
import type { BranchOption, Member } from '@/modules/members/types';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Members', href: MemberController.index.url() },
    { title: 'Register member', href: MemberController.create.url() },
];

export default function CreateMember({
    branches,
    duplicates,
}: {
    branches: BranchOption[];
    duplicates?: Member[];
}) {
    const [confirmDuplicate, setConfirmDuplicate] = useState(false);
    const form = useForm<MemberFormData>({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        gender: '',
        date_of_birth: '',
        address: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        branch_id: '',
        notes: '',
        joined_at: '',
        photo: null,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        form.transform((data) => ({
            ...data,
            confirm_duplicate: confirmDuplicate,
        }));
        form.post(MemberController.store.url(), { forceFormData: true });
    }

    return (
        <>
            <Head title="Register member" />

            <div className="grid w-full flex-1 gap-4 lg:grid-cols-2">
                <div className="flex flex-col gap-6">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Register member
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Add a new member to the gym.
                        </p>
                    </div>

                    {duplicates && duplicates.length > 0 && (
                        <Alert variant="destructive">
                            <AlertTitle>Possible duplicate member</AlertTitle>
                            <AlertDescription>
                                <ul className="list-inside list-disc">
                                    {duplicates.map((duplicate) => (
                                        <li key={duplicate.id}>
                                            {duplicate.full_name} —{' '}
                                            {duplicate.member_number}
                                            {duplicate.email
                                                ? ` (${duplicate.email})`
                                                : ''}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-3 flex items-center gap-2">
                                    <Checkbox
                                        id="confirm_duplicate"
                                        checked={confirmDuplicate}
                                        onCheckedChange={(checked) =>
                                            setConfirmDuplicate(checked === true)
                                        }
                                    />
                                    <Label htmlFor="confirm_duplicate">
                                        This is a different person — register anyway
                                    </Label>
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <MemberForm form={form} branches={branches} />

                        <div className="flex items-center gap-3">
                            <Button type="submit" disabled={form.processing}>
                                Register member
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={MemberController.index.url()}>
                                    Cancel
                                </Link>
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="hidden lg:block">
                    <MemberLivePreview data={form.data} branches={branches} />
                </div>
            </div>
        </>
    );
}

CreateMember.layout = { breadcrumbs };
