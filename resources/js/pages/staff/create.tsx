import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import { staffApi } from '@/modules/staff/api/staff';
import { StaffInviteForm } from '@/modules/staff/components/staff-invite-form';
import type { StaffInvitePreviewValues } from '@/modules/staff/components/staff-invite-form';
import { StaffLivePreview } from '@/modules/staff/components/staff-live-preview';
import type { InviteStaffValues } from '@/modules/staff/types';

const emptyPreview: StaffInvitePreviewValues = {
    name: '',
    email: '',
    jobTitle: '',
    phone: '',
    role: null,
    branches: [],
    primaryBranchId: null,
};

export default function StaffCreate() {
    const [preview, setPreview] = useState<StaffInvitePreviewValues>(emptyPreview);

    async function handleSubmit(values: Partial<InviteStaffValues>) {
        const response = await staffApi.invite(values);
        toast.success('Staff member added.');
        router.visit(`/staff/${response.data.id}`);
    }

    return (
        <>
            <Head title="Add staff" />

            <div className="grid w-full flex-1 gap-4 lg:grid-cols-2">
                <div className="max-w-2xl space-y-6">
                    <Heading
                        title="Add staff"
                        description="Add a new team member to the gym"
                    />
                    <StaffInviteForm
                        onSubmit={handleSubmit}
                        onValuesChange={setPreview}
                    />
                </div>

                <div className="hidden lg:block">
                    <StaffLivePreview values={preview} />
                </div>
            </div>
        </>
    );
}

StaffCreate.layout = {
    breadcrumbs: [
        { title: 'Staff', href: '/staff' },
        { title: 'Add staff', href: '/staff/create' },
    ],
};
