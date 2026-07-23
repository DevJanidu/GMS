import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ApiRequestError } from '@/lib/api/client';
import { rolesApi } from '@/modules/roles/api/roles';
import type { Role } from '@/modules/roles/types';
import { staffApi } from '@/modules/staff/api/staff';
import type { Staff } from '@/modules/staff/types';

export default function StaffEdit({ staffId }: { staffId: number }) {
    const [staff, setStaff] = useState<Staff | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [name, setName] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [phone, setPhone] = useState('');
    const [roleId, setRoleId] = useState<number | null>(null);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [processing, setProcessing] = useState(false);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        staffApi
            .get(staffId)
            .then((response) => {
                const member = response.data;
                setStaff(member);
                setName(member.name);
                setJobTitle(member.job_title ?? '');
                setPhone(member.phone ?? '');
                setRoleId(member.roles[0]?.id ?? null);
            })
            .catch(() => setLoadError(true));

        rolesApi.list().then((response) => setRoles(response.data));
    }, [staffId]);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await staffApi.update(staffId, {
                name,
                job_title: jobTitle,
                phone,
                role_id: roleId,
            });
            toast.success('Staff member updated.');
            router.visit(`/staff/${staffId}`);
        } catch (error) {
            if (error instanceof ApiRequestError && error.errors) {
                setErrors(error.errors);
            } else {
                toast.error('Failed to update staff member.');
            }
        } finally {
            setProcessing(false);
        }
    }

    return (
        <>
            <Head title="Edit staff member" />

            <div className="max-w-xl space-y-6">
                <Heading title="Edit staff member" />

                {loadError && (
                    <p className="text-sm text-destructive">
                        Unable to load this staff member.
                    </p>
                )}

                {!staff && !loadError && (
                    <div className="space-y-2">
                        <Skeleton className="h-9 w-full" />
                        <Skeleton className="h-9 w-full" />
                    </div>
                )}

                {staff && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <InputError message={errors.name?.[0]} />
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="job_title">Job title</Label>
                                <Input
                                    id="job_title"
                                    value={jobTitle}
                                    onChange={(e) =>
                                        setJobTitle(e.target.value)
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={roleId ? String(roleId) : undefined}
                                onValueChange={(value) =>
                                    setRoleId(Number(value))
                                }
                            >
                                <SelectTrigger id="role" className="w-full">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem
                                            key={role.id}
                                            value={String(role.id)}
                                        >
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.role_id?.[0]} />
                        </div>

                        <Button type="submit" disabled={processing}>
                            Save changes
                        </Button>
                    </form>
                )}
            </div>
        </>
    );
}

StaffEdit.layout = {
    breadcrumbs: [
        { title: 'Staff', href: '/staff' },
        { title: 'Edit staff member', href: '' },
    ],
};
