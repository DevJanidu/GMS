import { Head, router } from '@inertiajs/react';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import { staffApi } from '@/modules/staff/api/staff';
import { StaffInviteForm } from '@/modules/staff/components/staff-invite-form';
import type { InviteStaffValues } from '@/modules/staff/types';

export default function StaffCreate() {
    async function handleSubmit(values: Partial<InviteStaffValues>) {
        const response = await staffApi.invite(values);
        toast.success('Invitation sent.');
        router.visit(`/staff/${response.data.id}`);
    }

    return (
        <>
            <Head title="Invite staff" />

            <div className="max-w-2xl space-y-6">
                <Heading
                    title="Invite staff"
                    description="Send an invitation email to a new team member"
                />
                <StaffInviteForm onSubmit={handleSubmit} />
            </div>
        </>
    );
}

StaffCreate.layout = {
    breadcrumbs: [
        { title: 'Staff', href: '/staff' },
        { title: 'Invite staff', href: '/staff/create' },
    ],
};
