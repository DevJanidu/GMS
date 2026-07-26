import { Head, router } from '@inertiajs/react';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import { rolesApi } from '@/modules/roles/api/roles';
import { RoleForm } from '@/modules/roles/components/role-form';
import type { RoleFormValues } from '@/modules/roles/types';

export default function RoleCreate() {
    async function handleSubmit(values: RoleFormValues) {
        await rolesApi.create(values);
        toast.success('Role created.');
        router.visit('/roles');
    }

    return (
        <>
            <Head title="Add role" />

            <div className="w-full space-y-6">
                <Heading
                    title="Add role"
                    description="Create a custom role for your gym"
                />
                <RoleForm submitLabel="Create role" onSubmit={handleSubmit} />
            </div>
        </>
    );
}

RoleCreate.layout = {
    breadcrumbs: [
        { title: 'Roles', href: '/roles' },
        { title: 'Add role', href: '/roles/create' },
    ],
};
