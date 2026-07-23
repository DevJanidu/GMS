import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export default function StaffIndex() {
    const [staff, setStaff] = useState<Staff[] | null>(null);
    const [search, setSearch] = useState('');
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            staffApi
                .list({ search })
                .then((response) => setStaff(response.data))
                .catch(() => setLoadError(true));
        }, 250);

        return () => clearTimeout(timeout);
    }, [search]);

    async function handleToggleStatus(member: Staff) {
        try {
            const response =
                member.status === 'suspended'
                    ? await staffApi.activate(member.id)
                    : await staffApi.suspend(member.id);

            setStaff(
                (current) =>
                    current?.map((s) =>
                        s.id === member.id ? response.data : s,
                    ) ?? null,
            );
            toast.success(
                member.status === 'suspended'
                    ? 'Staff member activated.'
                    : 'Staff member suspended.',
            );
        } catch {
            toast.error('Action failed.');
        }
    }

    return (
        <>
            <Head title="Staff" />

            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <Heading title="Staff" description="Manage your team" />
                    <Button asChild>
                        <Link href="/staff/create">Invite staff</Link>
                    </Button>
                </div>

                <Input
                    placeholder="Search by name or email…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />

                {loadError && (
                    <p className="text-sm text-destructive">
                        Unable to load staff.
                    </p>
                )}

                {staff === null && !loadError && (
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                )}

                {staff !== null && staff.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        No staff members yet.
                    </p>
                )}

                {staff !== null && staff.length > 0 && (
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/50 text-left">
                                <tr>
                                    <th className="p-3 font-medium">Name</th>
                                    <th className="p-3 font-medium">Role</th>
                                    <th className="p-3 font-medium">
                                        Branches
                                    </th>
                                    <th className="p-3 font-medium">Status</th>
                                    <th className="p-3 font-medium" />
                                </tr>
                            </thead>
                            <tbody>
                                {staff.map((member) => (
                                    <tr
                                        key={member.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="p-3">
                                            <Link
                                                href={`/staff/${member.id}`}
                                                className="font-medium underline-offset-4 hover:underline"
                                            >
                                                {member.name}
                                            </Link>
                                            <div className="text-xs text-muted-foreground">
                                                {member.email}
                                            </div>
                                        </td>
                                        <td className="p-3 text-muted-foreground">
                                            {member.roles
                                                .map((r) => r.name)
                                                .join(', ') || '—'}
                                        </td>
                                        <td className="p-3 text-muted-foreground">
                                            {member.branches.length}
                                        </td>
                                        <td className="p-3">
                                            <Badge
                                                variant={
                                                    statusVariant[member.status]
                                                }
                                            >
                                                {member.status}
                                            </Badge>
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/staff/${member.id}/edit`}
                                                    >
                                                        Edit
                                                    </Link>
                                                </Button>
                                                {member.status !==
                                                    'invited' && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleToggleStatus(
                                                                member,
                                                            )
                                                        }
                                                    >
                                                        {member.status ===
                                                        'suspended'
                                                            ? 'Activate'
                                                            : 'Suspend'}
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

StaffIndex.layout = {
    breadcrumbs: [{ title: 'Staff', href: '/staff' }],
};
