import { Head, router } from '@inertiajs/react';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import { branchesApi } from '@/modules/branches/api/branches';
import { BranchForm } from '@/modules/branches/components/branch-form';
import type { BranchFormValues } from '@/modules/branches/types';

export default function BranchCreate() {
    async function handleSubmit(values: Partial<BranchFormValues>) {
        const response = await branchesApi.create(values);
        toast.success('Branch created.');
        router.visit(`/branches/${response.data.id}`);
    }

    return (
        <>
            <Head title="Add branch" />

            <div className="max-w-xl space-y-6">
                <Heading
                    title="Add branch"
                    description="Create a new gym location"
                />
                <BranchForm
                    submitLabel="Create branch"
                    onSubmit={handleSubmit}
                />
            </div>
        </>
    );
}

BranchCreate.layout = {
    breadcrumbs: [
        { title: 'Branches', href: '/branches' },
        { title: 'Add branch', href: '/branches/create' },
    ],
};
