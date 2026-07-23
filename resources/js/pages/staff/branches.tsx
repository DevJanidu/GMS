import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { branchesApi } from '@/modules/branches/api/branches';
import type { Branch } from '@/modules/branches/types';
import { staffApi } from '@/modules/staff/api/staff';
import { BranchPicker } from '@/modules/staff/components/branch-picker';
import type { Staff } from '@/modules/staff/types';

export default function StaffBranches({ staffId }: { staffId: number }) {
    const [staff, setStaff] = useState<Staff | null>(null);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selected, setSelected] = useState<number[]>([]);
    const [primary, setPrimary] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        staffApi
            .get(staffId)
            .then((response) => {
                setStaff(response.data);
                setSelected(response.data.branches.map((b) => b.id));
                setPrimary(
                    response.data.branches.find((b) => b.is_primary)?.id ??
                        null,
                );
            })
            .catch(() => setLoadError(true));

        branchesApi.list().then((response) => setBranches(response.data));
    }, [staffId]);

    async function handleSave() {
        setSaving(true);

        try {
            await staffApi.assignBranches(staffId, selected, primary);
            toast.success('Branch assignments updated.');
            router.visit(`/staff/${staffId}`);
        } catch {
            toast.error('Failed to update branch assignments.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <Head title="Assign branches" />

            <div className="max-w-xl space-y-6">
                <Heading
                    title="Assign branches"
                    description={staff ? staff.name : undefined}
                />

                {loadError && (
                    <p className="text-sm text-destructive">
                        Unable to load this staff member.
                    </p>
                )}

                {!staff && !loadError && <Skeleton className="h-48 w-full" />}

                {staff && (
                    <div className="space-y-4">
                        <BranchPicker
                            branches={branches}
                            selected={selected}
                            primary={primary}
                            onChange={(nextSelected, nextPrimary) => {
                                setSelected(nextSelected);
                                setPrimary(nextPrimary);
                            }}
                        />

                        <Button onClick={handleSave} disabled={saving}>
                            Save assignments
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}

StaffBranches.layout = {
    breadcrumbs: [
        { title: 'Staff', href: '/staff' },
        { title: 'Branch assignment', href: '' },
    ],
};
