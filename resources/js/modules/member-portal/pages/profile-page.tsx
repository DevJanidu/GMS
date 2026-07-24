import { Head } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AlertError from '@/components/alert-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ApiRequestError } from '@/lib/api/client';
import { memberPortalApi } from '../api/member-portal';
import type { ProfileInput } from '../api/member-portal';
import { PortalPageHeader } from '../components/portal-page-header';
import { PortalState } from '../components/portal-state';
import { useMemberPortalResource } from '../hooks/use-member-portal-resource';

const emptyForm: ProfileInput = {
    first_name: '',
    last_name: '',
    phone: null,
    address: null,
    emergency_contact_name: null,
    emergency_contact_phone: null,
};

export default function MemberPortalProfilePage() {
    const resource = useMemberPortalResource(memberPortalApi.profile);
    const [form, setForm] = useState<ProfileInput>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        const timer = window.setTimeout(() => {
            if (resource.data) {
                setForm({
                    first_name: resource.data.first_name,
                    last_name: resource.data.last_name,
                    phone: resource.data.phone,
                    address: resource.data.address,
                    emergency_contact_name:
                        resource.data.emergency_contact_name,
                    emergency_contact_phone:
                        resource.data.emergency_contact_phone,
                });
            }
        }, 0);

        return () => window.clearTimeout(timer);
    }, [resource.data]);

    function field<K extends keyof ProfileInput>(key: K, value: ProfileInput[K]) {
        setForm((current) => ({ ...current, [key]: value }));
    }

    function submit(event: FormEvent) {
        event.preventDefault();
        setSaving(true);
        setErrors({});

        memberPortalApi
            .updateProfile(form)
            .then(() => toast.success('Profile updated.'))
            .catch((reason: unknown) => {
                if (reason instanceof ApiRequestError) {
                    setErrors(reason.errors ?? { profile: [reason.message] });
                } else {
                    setErrors({ profile: ['Unable to update your profile.'] });
                }
            })
            .finally(() => setSaving(false));
    }

    return (
        <>
            <Head title="My profile" />
            <PortalPageHeader
                title="My profile"
                description="Keep your contact and emergency information current."
            />
            <PortalState {...resource}>
                {(profile) => (
                    <Card>
                        <CardContent className="p-6">
                            <form
                                onSubmit={submit}
                                className="grid gap-5 md:grid-cols-2"
                            >
                                {Object.keys(errors).length > 0 && (
                                    <div className="md:col-span-2">
                                        <AlertError
                                            errors={Object.values(
                                                errors,
                                            ).flat()}
                                        />
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">
                                        First name
                                    </Label>
                                    <Input
                                        id="first_name"
                                        value={form.first_name}
                                        onChange={(event) =>
                                            field(
                                                'first_name',
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Last name</Label>
                                    <Input
                                        id="last_name"
                                        value={form.last_name}
                                        onChange={(event) =>
                                            field(
                                                'last_name',
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="member_number">
                                        Member number
                                    </Label>
                                    <Input
                                        id="member_number"
                                        value={profile.member_number}
                                        disabled
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        value={profile.email ?? ''}
                                        disabled
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={form.phone ?? ''}
                                        onChange={(event) =>
                                            field('phone', event.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="emergency_contact_name">
                                        Emergency contact
                                    </Label>
                                    <Input
                                        id="emergency_contact_name"
                                        value={
                                            form.emergency_contact_name ?? ''
                                        }
                                        onChange={(event) =>
                                            field(
                                                'emergency_contact_name',
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="emergency_contact_phone">
                                        Emergency phone
                                    </Label>
                                    <Input
                                        id="emergency_contact_phone"
                                        value={
                                            form.emergency_contact_phone ?? ''
                                        }
                                        onChange={(event) =>
                                            field(
                                                'emergency_contact_phone',
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Textarea
                                        id="address"
                                        value={form.address ?? ''}
                                        onChange={(event) =>
                                            field('address', event.target.value)
                                        }
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Button disabled={saving}>
                                        {saving
                                            ? 'Saving…'
                                            : 'Save profile changes'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </PortalState>
        </>
    );
}
