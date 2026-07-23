import { useState } from 'react';
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
import type { BranchFormValues } from '../types';

type BranchFormProps = {
    initialValues?: Partial<BranchFormValues>;
    submitLabel: string;
    onSubmit: (values: Partial<BranchFormValues>) => Promise<unknown>;
};

const emptyValues: BranchFormValues = {
    name: '',
    code: '',
    address: '',
    phone: '',
    email: '',
    status: 'active',
};

export function BranchForm({
    initialValues,
    submitLabel,
    onSubmit,
}: BranchFormProps) {
    const [values, setValues] = useState<BranchFormValues>({
        ...emptyValues,
        ...initialValues,
    });
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [processing, setProcessing] = useState(false);

    function set<K extends keyof BranchFormValues>(
        key: K,
        value: BranchFormValues[K],
    ) {
        setValues((current) => ({ ...current, [key]: value }));
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await onSubmit(values);
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
                <Label htmlFor="name">Branch name</Label>
                <Input
                    id="name"
                    value={values.name}
                    onChange={(e) => set('name', e.target.value)}
                    required
                />
                <InputError message={errors.name?.[0]} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="code">Branch code</Label>
                <Input
                    id="code"
                    value={values.code}
                    onChange={(e) => set('code', e.target.value.toUpperCase())}
                    required
                />
                <InputError message={errors.code?.[0]} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                    id="address"
                    value={values.address}
                    onChange={(e) => set('address', e.target.value)}
                />
                <InputError message={errors.address?.[0]} />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        value={values.phone}
                        onChange={(e) => set('phone', e.target.value)}
                    />
                    <InputError message={errors.phone?.[0]} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={values.email}
                        onChange={(e) => set('email', e.target.value)}
                    />
                    <InputError message={errors.email?.[0]} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                    value={values.status}
                    onValueChange={(value) =>
                        set('status', value as BranchFormValues['status'])
                    }
                >
                    <SelectTrigger id="status" className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={errors.status?.[0]} />
            </div>

            <Button type="submit" disabled={processing}>
                {submitLabel}
            </Button>
        </form>
    );
}
