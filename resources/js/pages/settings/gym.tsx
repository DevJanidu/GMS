import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { ApiRequestError } from '@/lib/api/client';
import { gymProfileApi } from '@/modules/settings/gym/api/gym-profile';
import type {
    GymProfile,
    GymProfileFormValues,
} from '@/modules/settings/gym/types';

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
};

export default function GymSettings() {
    const [profile, setProfile] = useState<GymProfile | null>(null);
    const [values, setValues] = useState<GymProfileFormValues>(emptyValues);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [processing, setProcessing] = useState(false);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
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
                });
            })
            .catch(() => setLoadError(true));
    }, []);

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
            toast.success('Gym settings updated.');
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

    return (
        <>
            <Head title="Gym settings" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Gym settings"
                    description={
                        profile
                            ? profile.tenant.name
                            : 'Manage your gym profile'
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
                            <Label htmlFor="legal_name">Legal name</Label>
                            <Input
                                id="legal_name"
                                value={values.legal_name}
                                onChange={(e) =>
                                    set('legal_name', e.target.value)
                                }
                            />
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
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={values.description}
                                onChange={(e) =>
                                    set('description', e.target.value)
                                }
                                rows={4}
                            />
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
