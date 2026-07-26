import { router, usePage } from '@inertiajs/react';
import { ImagePlus, User as UserIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Textarea } from '@/components/ui/textarea';
import { ApiRequestError } from '@/lib/api/client';
import { CURRENCY_OPTIONS } from '@/lib/currencies';
import { can } from '@/lib/permissions/can';
import { gymProfileApi } from '@/modules/settings/gym/api/gym-profile';
import type {
    GymProfile,
    GymProfileFormValues,
} from '@/modules/settings/gym/types';
import type { Auth } from '@/types';

const emptyValues: GymProfileFormValues = {
    legal_name: '',
    address: '',
    city: '',
    country: '',
    contact_email: '',
    contact_phone: '',
    tax_id: '',
    website: '',
    description: '',
    logo: null,
    currency: 'USD',
};

export function GymProfileForm() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const canViewGymProfile = can(auth.user, 'gym.view');

    const [profile, setProfile] = useState<GymProfile | null>(null);
    const [values, setValues] = useState<GymProfileFormValues>(emptyValues);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [processing, setProcessing] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const logoInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!canViewGymProfile) {
            return;
        }

        gymProfileApi
            .get()
            .then((response) => {
                setProfile(response.data);
                setValues({
                    legal_name: response.data.legal_name ?? '',
                    address: response.data.address ?? '',
                    city: response.data.city ?? '',
                    country: response.data.country ?? '',
                    contact_email: response.data.contact_email ?? '',
                    contact_phone: response.data.contact_phone ?? '',
                    tax_id: response.data.tax_id ?? '',
                    website: response.data.website ?? '',
                    description: response.data.description ?? '',
                    logo: null,
                    currency: response.data.tenant.currency ?? 'USD',
                });
            })
            .catch(() => setLoadError(true));
    }, [canViewGymProfile]);

    const logoPreview = useMemo(
        () => (values.logo ? URL.createObjectURL(values.logo) : null),
        [values.logo],
    );

    useEffect(() => {
        return () => {
            if (logoPreview) {
                URL.revokeObjectURL(logoPreview);
            }
        };
    }, [logoPreview]);

    function set<K extends keyof GymProfileFormValues>(
        key: K,
        value: GymProfileFormValues[K],
    ) {
        setValues((current) => ({ ...current, [key]: value }));
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = await gymProfileApi.update(values);
            setProfile(response.data);
            setValues((current) => ({ ...current, logo: null }));
            toast.success('Gym settings updated.');

            // Refresh the shared "gym" prop so the sidebar's name/logo/
            // description reflect the change immediately, without a full
            // page reload.
            router.reload({ only: ['gym'] });
        } catch (error) {
            if (error instanceof ApiRequestError && error.errors) {
                setErrors(error.errors);
            } else {
                toast.error('Failed to update gym settings.');
            }
        } finally {
            setProcessing(false);
        }
    }

    if (!canViewGymProfile) {
        return null;
    }

    return (
        <div className="space-y-6">
            <Heading
                variant="small"
                title="Gym profile"
                description={
                    profile
                        ? profile.tenant.name
                        : "Your gym's name, logo, and contact details"
                }
            />

            {loadError && (
                <p className="text-sm text-destructive">
                    Unable to load gym settings.
                </p>
            )}

            {!profile && !loadError && (
                <div className="space-y-2">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                </div>
            )}

            {profile && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-2">
                        <Label>Gym logo</Label>
                        <div className="flex items-center gap-4">
                            <Avatar className="size-16 rounded-xl border">
                                {(logoPreview || profile.logo_url) && (
                                    <AvatarImage
                                        src={logoPreview ?? profile.logo_url ?? undefined}
                                        alt="Gym logo"
                                        className="object-cover"
                                    />
                                )}
                                <AvatarFallback className="rounded-xl">
                                    <UserIcon className="size-6 text-muted-foreground" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => logoInputRef.current?.click()}
                                >
                                    <ImagePlus className="size-4" />
                                    Upload logo
                                </Button>
                                <Input
                                    id="logo"
                                    ref={logoInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="sr-only!"
                                    onChange={(e) =>
                                        set('logo', e.target.files?.[0] ?? null)
                                    }
                                />
                                <p className="text-xs text-muted-foreground">
                                    Shown next to your gym name in the
                                    sidebar. PNG or JPG, up to 4MB.
                                </p>
                                {errors.logo?.[0] && (
                                    <p className="text-sm text-destructive">
                                        {errors.logo[0]}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="legal_name">Gym name</Label>
                        <Input
                            id="legal_name"
                            value={values.legal_name}
                            onChange={(e) =>
                                set('legal_name', e.target.value)
                            }
                        />
                        <p className="text-xs text-muted-foreground">
                            Shown in the sidebar and used as your gym&apos;s
                            official name.
                        </p>
                        {errors.legal_name?.[0] && (
                            <p className="text-sm text-destructive">
                                {errors.legal_name[0]}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="contact_email">
                                Contact email
                            </Label>
                            <Input
                                id="contact_email"
                                type="email"
                                value={values.contact_email}
                                onChange={(e) =>
                                    set('contact_email', e.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="contact_phone">
                                Contact phone
                            </Label>
                            <Input
                                id="contact_phone"
                                value={values.contact_phone}
                                onChange={(e) =>
                                    set('contact_phone', e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            value={values.address}
                            onChange={(e) => set('address', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                value={values.city}
                                onChange={(e) =>
                                    set('city', e.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                value={values.country}
                                onChange={(e) =>
                                    set('country', e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select
                            value={values.currency}
                            onValueChange={(value) =>
                                set('currency', value)
                            }
                        >
                            <SelectTrigger id="currency" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {CURRENCY_OPTIONS.map((option) => (
                                    <SelectItem
                                        key={option.code}
                                        value={option.code}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Used to format prices across plans, invoices, and
                            receipts.
                        </p>
                        {errors.currency?.[0] && (
                            <p className="text-sm text-destructive">
                                {errors.currency[0]}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="tax_id">Tax ID</Label>
                            <Input
                                id="tax_id"
                                value={values.tax_id}
                                onChange={(e) =>
                                    set('tax_id', e.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                value={values.website}
                                onChange={(e) =>
                                    set('website', e.target.value)
                                }
                            />
                            {errors.website?.[0] && (
                                <p className="text-sm text-destructive">
                                    {errors.website[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">
                            Short description
                        </Label>
                        <Textarea
                            id="description"
                            value={values.description}
                            onChange={(e) =>
                                set('description', e.target.value)
                            }
                            rows={4}
                        />
                        <p className="text-xs text-muted-foreground">
                            Shown under your gym name in the sidebar.
                        </p>
                    </div>

                    <Button type="submit" disabled={processing}>
                        Save changes
                    </Button>
                </form>
            )}
        </div>
    );
}
