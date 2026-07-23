import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
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
import { ApiRequestError } from '@/lib/api/client';
import { branchesApi } from '@/modules/branches/api/branches';
import type { Branch } from '@/modules/branches/types';
import { rolesApi } from '@/modules/roles/api/roles';
import type { Role } from '@/modules/roles/types';
import type { InviteStaffValues } from '../types';
import { BranchPicker } from './branch-picker';

export type StaffInvitePreviewValues = {
    name: string;
    email: string;
    jobTitle: string;
    phone: string;
    role: Role | null;
    branches: Branch[];
    primaryBranchId: number | null;
};

type StaffInviteFormProps = {
    onSubmit: (values: Partial<InviteStaffValues>) => Promise<unknown>;
    onValuesChange?: (values: StaffInvitePreviewValues) => void;
};

export function StaffInviteForm({
    onSubmit,
    onValuesChange,
}: StaffInviteFormProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [phone, setPhone] = useState('');
    const [roleId, setRoleId] = useState<number | null>(null);
    const [branchIds, setBranchIds] = useState<number[]>([]);
    const [primaryBranchId, setPrimaryBranchId] = useState<number | null>(null);

    const [roles, setRoles] = useState<Role[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        rolesApi.list().then((response) => setRoles(response.data));
        branchesApi.list().then((response) => setBranches(response.data));
    }, []);

    useEffect(() => {
        onValuesChange?.({
            name,
            email,
            jobTitle,
            phone,
            role: roles.find((role) => role.id === roleId) ?? null,
            branches: branches.filter((branch) =>
                branchIds.includes(branch.id),
            ),
            primaryBranchId,
        });
    }, [
        name,
        email,
        jobTitle,
        phone,
        roleId,
        branchIds,
        primaryBranchId,
        roles,
        branches,
        onValuesChange,
    ]);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await onSubmit({
                name,
                email,
                job_title: jobTitle,
                phone,
                role_id: roleId,
                branch_ids: branchIds,
                primary_branch_id: primaryBranchId,
            });
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

            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <InputError message={errors.email?.[0]} />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="job_title">Job title</Label>
                    <Input
                        id="job_title"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
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
                    onValueChange={(value) => setRoleId(Number(value))}
                >
                    <SelectTrigger id="role" className="w-full">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        {roles.map((role) => (
                            <SelectItem key={role.id} value={String(role.id)}>
                                {role.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.role_id?.[0]} />
            </div>

            <div>
                <Label>Branches</Label>
                <div className="mt-2">
                    <BranchPicker
                        branches={branches}
                        selected={branchIds}
                        primary={primaryBranchId}
                        onChange={(selected, primary) => {
                            setBranchIds(selected);
                            setPrimaryBranchId(primary);
                        }}
                    />
                </div>
                <InputError message={errors.branch_ids?.[0]} />
            </div>

            <Button type="submit" disabled={processing}>
                Add staff
            </Button>
        </form>
    );
}
