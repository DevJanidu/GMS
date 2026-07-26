import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { rolesApi } from '@/modules/roles/api/roles';
import type { Role } from '@/modules/roles/types';

export default function RoleIndex() {
    const [roles, setRoles] = useState<Role[] | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        rolesApi
            .list()
            .then((response) => setRoles(response.data))
            .catch(() => setLoadError(true));
    }, []);

    async function handleDelete(role: Role) {
        try {
            await rolesApi.remove(role.id);
            setRoles(
                (current) => current?.filter((r) => r.id !== role.id) ?? null,
            );
            toast.success('Role deleted.');
        } catch {
            toast.error('Failed to delete role.');
        }
    }

    return (
        <>
            <Head title="Roles" />

            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <Heading
                        title="Roles"
                        description="Manage staff roles and permissions"
                    />
                    <Button asChild>
                        <Link href="/roles/create">Add role</Link>
                    </Button>
                </div>

                {loadError && (
                    <p className="text-sm text-destructive">
                        Unable to load roles.
                    </p>
                )}

                {roles === null && !loadError && (
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                )}

                {roles !== null && (
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/50 text-left">
                                <tr>
                                    <th className="p-3 font-medium">Name</th>
                                    <th className="p-3 font-medium">Type</th>
                                    <th className="p-3 font-medium">
                                        Permissions
                                    </th>
                                    <th className="p-3 font-medium">Staff</th>
                                    <th className="p-3 font-medium" />
                                </tr>
                            </thead>
                            <tbody>
                                {roles.map((role) => (
                                    <tr
                                        key={role.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="p-3 font-medium">
                                            {role.name}
                                        </td>
                                        <td className="p-3">
                                            <Badge
                                                variant={
                                                    role.is_system
                                                        ? 'secondary'
                                                        : 'default'
                                                }
                                            >
                                                {role.is_system
                                                    ? 'System'
                                                    : 'Custom'}
                                            </Badge>
                                        </td>
                                        <td className="p-3 text-muted-foreground">
                                            {role.permissions.length}
                                        </td>
                                        <td className="p-3 text-muted-foreground">
                                            {role.users_count ?? 0}
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                {role.slug !== 'owner' && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/roles/${role.id}/edit`}
                                                        >
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                )}
                                                {!role.is_system && (
                                                    <ConfirmationDialog
                                                        trigger={
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                            >
                                                                Delete
                                                            </Button>
                                                        }
                                                        title="Delete role"
                                                        description={`Delete role "${role.name}"? Staff assigned to it will need a new role.`}
                                                        confirmLabel="Delete"
                                                        destructive
                                                        onConfirm={() =>
                                                            handleDelete(role)
                                                        }
                                                    />
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

RoleIndex.layout = {
    breadcrumbs: [{ title: 'Roles', href: '/roles' }],
};
