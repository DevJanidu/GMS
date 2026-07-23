import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ApiRequestError } from '@/lib/api/client';
import { permissionsApi } from '../api/roles';
import type { Permission, RoleFormValues } from '../types';
import { PermissionMatrix } from './permission-matrix';

type RoleFormProps = {
    initialValues?: Partial<RoleFormValues>;
    submitLabel: string;
    onSubmit: (values: RoleFormValues) => Promise<unknown>;
};

export function RoleForm({
    initialValues,
    submitLabel,
    onSubmit,
}: RoleFormProps) {
    const [name, setName] = useState(initialValues?.name ?? '');
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
        initialValues?.permissions ?? [],
    );
    const [permissions, setPermissions] = useState<Permission[] | null>(null);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        permissionsApi.list().then((response) => setPermissions(response.data));
    }, []);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await onSubmit({ name, permissions: selectedPermissions });
        } catch (error) {
            if (error instanceof ApiRequestError && error.errors) {
                setErrors(error.errors);
            } else {
                throw error;
            }
        } finally {
            setProcessing(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid max-w-sm gap-2">
                <Label htmlFor="name">Role name</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <InputError message={errors.name?.[0]} />
            </div>

            <div>
                <h2 className="mb-3 text-sm font-medium">Permissions</h2>

                {permissions === null && (
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                    </div>
                )}

                {permissions !== null && (
                    <PermissionMatrix
                        permissions={permissions}
                        selected={selectedPermissions}
                        onChange={setSelectedPermissions}
                    />
                )}
            </div>

            <Button type="submit" disabled={processing}>
                {submitLabel}
            </Button>
        </form>
    );
}
