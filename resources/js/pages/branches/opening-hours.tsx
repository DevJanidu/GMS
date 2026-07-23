import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import { Skeleton } from '@/components/ui/skeleton';
import { ApiRequestError } from '@/lib/api/client';
import { branchesApi } from '@/modules/branches/api/branches';
import { OpeningHoursEditor } from '@/modules/branches/components/opening-hours-editor';
import type { Branch, OpeningHours } from '@/modules/branches/types';

export default function BranchOpeningHours({ branchId }: { branchId: number }) {
    const [branch, setBranch] = useState<Branch | null>(null);
    const [hours, setHours] = useState<OpeningHours>({});
    const [saving, setSaving] = useState(false);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        branchesApi
            .get(branchId)
            .then((response) => {
                setBranch(response.data);
                setHours(response.data.opening_hours ?? {});
            })
            .catch(() => setLoadError(true));
    }, [branchId]);

    async function handleSave() {
        setSaving(true);

        try {
            await branchesApi.updateOpeningHours(branchId, hours);
            toast.success('Opening hours updated.');
        } catch (error) {
            if (error instanceof ApiRequestError) {
                toast.error(error.message);
            } else {
                toast.error('Failed to update opening hours.');
            }
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <Head title="Opening hours" />

            <div className="max-w-2xl space-y-6">
                <Heading
                    title="Opening hours"
                    description={
                        branch ? `${branch.name} · ${branch.code}` : undefined
                    }
                />

                {loadError && (
                    <p className="text-sm text-destructive">
                        Unable to load this branch.
                    </p>
                )}

                {!branch && !loadError && <Skeleton className="h-64 w-full" />}

                {branch && (
                    <OpeningHoursEditor
                        value={hours}
                        onChange={setHours}
                        onSave={handleSave}
                        saving={saving}
                    />
                )}
            </div>
        </>
    );
}

BranchOpeningHours.layout = {
    breadcrumbs: [
        { title: 'Branches', href: '/branches' },
        { title: 'Opening hours', href: '' },
    ],
};
