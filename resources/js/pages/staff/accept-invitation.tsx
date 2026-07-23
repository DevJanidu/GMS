import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient, ApiRequestError } from '@/lib/api/client';
import type { ApiSuccess } from '@/lib/api/client';

type InvitationInfo = {
    name: string;
    email: string;
};

export default function AcceptInvitation({ userId }: { userId: number }) {
    const [invitation, setInvitation] = useState<InvitationInfo | null>(null);
    const [invalid, setInvalid] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [processing, setProcessing] = useState(false);
    const [accepted, setAccepted] = useState(false);

    const search = typeof window !== 'undefined' ? window.location.search : '';

    useEffect(() => {
        apiClient
            .get<ApiSuccess<InvitationInfo>>(
                `/staff/invitations/${userId}${search}`,
            )
            .then((response) => setInvitation(response.data))
            .catch(() => setInvalid(true));
    }, [userId, search]);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await apiClient.post(
                `/staff/invitations/${userId}/accept${search}`,
                {
                    password,
                    password_confirmation: passwordConfirmation,
                },
            );
            setAccepted(true);
            window.location.href = '/dashboard';
        } catch (error) {
            if (error instanceof ApiRequestError && error.errors) {
                setErrors(error.errors);
            } else {
                setInvalid(true);
            }
        } finally {
            setProcessing(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-6">
            <Head title="Accept invitation" />

            <div className="w-full max-w-sm space-y-6">
                <div>
                    <h1 className="text-xl font-semibold">
                        Accept your invitation
                    </h1>
                    {invitation && (
                        <p className="mt-1 text-sm text-muted-foreground">
                            Set a password for {invitation.email} to get
                            started.
                        </p>
                    )}
                </div>

                {invalid && (
                    <p className="text-sm text-destructive">
                        This invitation link is invalid or has expired.
                    </p>
                )}

                {!invalid && !invitation && (
                    <p className="text-sm text-muted-foreground">Loading…</p>
                )}

                {!invalid && invitation && !accepted && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <InputError message={errors.password?.[0]} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                Confirm password
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={passwordConfirmation}
                                onChange={(e) =>
                                    setPasswordConfirmation(e.target.value)
                                }
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full"
                        >
                            Set password and sign in
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}

AcceptInvitation.layout = (page: ReactElement) => page;
