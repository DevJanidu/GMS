import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { staffApi } from '@/modules/staff/api/staff';
import type { Staff } from '@/modules/staff/types';

const statusVariant: Record<
    Staff['status'],
    'default' | 'secondary' | 'destructive'
> = {
    active: 'default',
    invited: 'secondary',
    suspended: 'destructive',
};

export default function StaffShow({ staffId }: { staffId: number }) {
    const [staff, setStaff] = useState<Staff | null>(null);
    const [loadError, setLoadError] = useState(false);

    function reload() {
        staffApi
            .get(staffId)
            .then((response) => setStaff(response.data))
            .catch(() => setLoadError(true));
    }

    useEffect(reload, [staffId]);

    async function handleToggleStatus() {
        if (!staff) {
            return;
        }

        try {
            const response =
                staff.status === 'suspended'
                    ? await staffApi.activate(staff.id)
                    : await staffApi.suspend(staff.id);
            setStaff(response.data);
            toast.success(
                staff.status === 'suspended'
                    ? 'Staff member activated.'
                    : 'Staff member suspended.',
            );
        } catch {
            toast.error('Action failed.');
        }
    }

    async function handleDelete() {
        if (!staff || !confirm(`Remove ${staff.name} from your team?`)) {
            return;
        }

        try {
            await staffApi.remove(staff.id);
            toast.success('Staff member removed.');
            router.visit('/staff');
        } catch {
            toast.error('Failed to remove staff member.');
        }
    }

    if (loadError) {
        return (
            <>
                <Head title="Staff member not found" />
                <p className="text-sm text-destructive">
                    Unable to load this staff member.
                </p>
            </>
        );
    }

    if (!staff) {
        return (
            <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    return (
        <>
            <Head title={staff.name} />

            <div className="max-w-2xl space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <Heading title={staff.name} description={staff.email} />
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/staff/${staff.id}/branches`}>
                                Branches
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={`/staff/${staff.id}/edit`}>Edit</Link>
                        </Button>
                    </div>
                </div>

                <dl className="grid grid-cols-1 gap-4 rounded-lg border p-4 sm:grid-cols-2">
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Status
                        </dt>
                        <dd className="mt-1">
                            <Badge variant={statusVariant[staff.status]}>
                                {staff.status}
                            </Badge>
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">Role</dt>
                        <dd className="mt-1">
                            {staff.roles.map((r) => r.name).join(', ') || '—'}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Job title
                        </dt>
                        <dd className="mt-1">{staff.job_title || '—'}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">Phone</dt>
                        <dd className="mt-1">{staff.phone || '—'}</dd>
                    </div>
                    <div className="sm:col-span-2">
                        <dt className="text-sm text-muted-foreground">
                            Branches
                        </dt>
                        <dd className="mt-1">
                            {staff.branches.length === 0
                                ? '—'
                                : staff.branches
                                      .map(
                                          (b) =>
                                              `${b.name}${b.is_primary ? ' (primary)' : ''}`,
                                      )
                                      .join(', ')}
                        </dd>
                    </div>
                </dl>

                <div className="flex gap-2">
                    {staff.status !== 'invited' && (
                        <Button variant="outline" onClick={handleToggleStatus}>
                            {staff.status === 'suspended'
                                ? 'Activate'
                                : 'Suspend'}
                        </Button>
                    )}
                    <Button variant="destructive" onClick={handleDelete}>
                        Remove staff member
                    </Button>
                </div>
            </div>
        </>
    );
}

StaffShow.layout = {
    breadcrumbs: [
        { title: 'Staff', href: '/staff' },
        { title: 'Details', href: '' },
    ],
};
