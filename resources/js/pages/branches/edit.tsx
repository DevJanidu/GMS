import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import { Skeleton } from '@/components/ui/skeleton';
import { branchesApi } from '@/modules/branches/api/branches';
import { BranchForm } from '@/modules/branches/components/branch-form';
import type { Branch, BranchFormValues } from '@/modules/branches/types';

export default function BranchEdit({ branchId }: { branchId: number }) {
    const [branch, setBranch] = useState<Branch | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        branchesApi
            .get(branchId)
            .then((response) => setBranch(response.data))
            .catch(() => setLoadError(true));
    }, [branchId]);

    async function handleSubmit(values: Partial<BranchFormValues>) {
        await branchesApi.update(branchId, values);
        toast.success('Branch updated.');
        router.visit(`/branches/${branchId}`);
    }

    return (
        <>
            <Head title="Edit branch" />

            <div className="max-w-xl space-y-6">
                <Heading title="Edit branch" />

                {loadError && (
                    <p className="text-sm text-destructive">
                        Unable to load this branch.
                    </p>
                )}

                {!branch && !loadError && (
                    <div className="space-y-2">
                        <Skeleton className="h-9 w-full" />
                        <Skeleton className="h-9 w-full" />
                    </div>
                )}

                {branch && (
                    <BranchForm
                        initialValues={{
                            name: branch.name,
                            code: branch.code,
                            address: branch.address ?? '',
                            phone: branch.phone ?? '',
                            email: branch.email ?? '',
                            status: branch.status,
                        }}
                        submitLabel="Save changes"
                        onSubmit={handleSubmit}
                    />
                )}
            </div>
        </>
    );
}

BranchEdit.layout = {
    breadcrumbs: [
        { title: 'Branches', href: '/branches' },
        { title: 'Edit branch', href: '' },
    ],
};
