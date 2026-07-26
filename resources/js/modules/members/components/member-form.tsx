import type { InertiaFormProps } from '@inertiajs/react';
import { ImagePlus, X } from 'lucide-react';
import { useRef } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import type { BranchOption } from '@/modules/members/types';

export type MemberFormData = {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    gender: string;
    date_of_birth: string;
    address: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    branch_id: string;
    notes: string;
    joined_at: string;
    photo: File | null;
};

export function MemberForm({
    form,
    branches,
}: {
    form: InertiaFormProps<MemberFormData>;
    branches: BranchOption[];
}) {
    const { data, setData, errors } = form;
    const photoInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="first_name">First name</Label>
                    <Input
                        id="first_name"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                        required
                    />
                    <InputError message={errors.first_name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="last_name">Last name</Label>
                    <Input
                        id="last_name"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        required
                    />
                    <InputError message={errors.last_name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                    />
                    <InputError message={errors.phone} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                        value={data.gender || undefined}
                        onValueChange={(value) => setData('gender', value)}
                    >
                        <SelectTrigger id="gender" className="w-full">
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer_not_to_say">
                                Prefer not to say
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.gender} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="date_of_birth">Date of birth</Label>
                    <Input
                        id="date_of_birth"
                        type="date"
                        value={data.date_of_birth}
                        onChange={(e) =>
                            setData('date_of_birth', e.target.value)
                        }
                    />
                    <InputError message={errors.date_of_birth} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="branch_id">Home branch</Label>
                    <Select
                        value={data.branch_id || undefined}
                        onValueChange={(value) => setData('branch_id', value)}
                    >
                        <SelectTrigger id="branch_id" className="w-full">
                            <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                            {branches.map((branch) => (
                                <SelectItem
                                    key={branch.id}
                                    value={String(branch.id)}
                                >
                                    {branch.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.branch_id} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="joined_at">Joined on</Label>
                    <Input
                        id="joined_at"
                        type="date"
                        value={data.joined_at}
                        onChange={(e) => setData('joined_at', e.target.value)}
                    />
                    <InputError message={errors.joined_at} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                    id="address"
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                />
                <InputError message={errors.address} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="emergency_contact_name">
                        Emergency contact name
                    </Label>
                    <Input
                        id="emergency_contact_name"
                        value={data.emergency_contact_name}
                        onChange={(e) =>
                            setData('emergency_contact_name', e.target.value)
                        }
                    />
                    <InputError message={errors.emergency_contact_name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="emergency_contact_phone">
                        Emergency contact phone
                    </Label>
                    <Input
                        id="emergency_contact_phone"
                        value={data.emergency_contact_phone}
                        onChange={(e) =>
                            setData('emergency_contact_phone', e.target.value)
                        }
                    />
                    <InputError message={errors.emergency_contact_phone} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                    id="notes"
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                />
                <InputError message={errors.notes} />
            </div>

            <div className="grid gap-2">
                <Label>Photo</Label>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => photoInputRef.current?.click()}
                    >
                        <ImagePlus className="size-4" />
                        Profile Photo
                    </Button>
                    {data.photo && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setData('photo', null)}
                        >
                            <X className="size-4" />
                            Remove
                        </Button>
                    )}
                </div>
                <Input
                    id="photo"
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only!"
                    onChange={(e) =>
                        setData('photo', e.target.files?.[0] ?? null)
                    }
                />
                <p className="text-xs text-muted-foreground">
                    PNG or JPG, up to 4MB.
                </p>
                <InputError message={errors.photo} />
            </div>
        </div>
    );
}
