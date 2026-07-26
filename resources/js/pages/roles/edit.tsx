import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import { Skeleton } from '@/components/ui/skeleton';
import { rolesApi } from '@/modules/roles/api/roles';
import { RoleForm } from '@/modules/roles/components/role-form';
import type { Role, RoleFormValues } from '@/modules/roles/types';

export default function RoleEdit({ roleId }: { roleId: number }) {
    const [role, setRole] = useState<Role | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        rolesApi
            .get(roleId)
            .then((response) => setRole(response.data))
            .catch(() => setLoadError(true));
    }, [roleId]);

    async function handleSubmit(values: RoleFormValues) {
        await rolesApi.update(roleId, values);
        toast.success('Role updated.');
        router.visit('/roles');
    }

    return (
        <>
            <Head title="Edit role" />

            <div className="w-full space-y-6">
                <Heading
                    title={role ? `Edit ${role.name}` : 'Edit role'}
                    description={
                        role?.is_system
                            ? 'Built-in role — adjust its permissions below.'
                            : undefined
                    }
                />

                {loadError && (
                    <p className="text-sm text-destructive">
                        Unable to load this role.
                    </p>
                )}

                {!role && !loadError && (
                    <div className="space-y-2">
                        <Skeleton className="h-9 w-full" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                )}

                {role && (
                    <RoleForm
                        initialValues={{
                            name: role.name,
                            permissions: role.permissions.map((p) => p.id),
                        }}
                        submitLabel="Save changes"
                        onSubmit={handleSubmit}
                        nameLocked={role.is_system}
                    />
                )}
            </div>
        </>
    );
}

RoleEdit.layout = {
    breadcrumbs: [
        { title: 'Roles', href: '/roles' },
        { title: 'Edit role', href: '' },
    ],
};
