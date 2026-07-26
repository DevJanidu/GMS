import { Head } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

function readCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));

    return match ? decodeURIComponent(match[1]) : null;
}

type SubmitFailure = 'expired' | 'session' | 'network';

const FAILURE_MESSAGES: Record<SubmitFailure, string> = {
    expired: 'This invitation link is invalid or has expired.',
    session: "Your session couldn't be verified. Please reopen the invitation link from your email and try again.",
    network: "We couldn't reach the server. Check your connection and try again.",
};

export default function AcceptMemberPortalInvitation({
    invalid,
    name,
    email,
    gymName,
    gymLogoUrl,
}: {
    userId: number;
    invalid: boolean;
    name: string | null;
    email: string | null;
    gymName?: string | null;
    gymLogoUrl?: string | null;
}) {
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [processing, setProcessing] = useState(false);
    const [linkInvalid, setLinkInvalid] = useState(invalid);
    const [failure, setFailure] = useState<SubmitFailure | null>(null);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setProcessing(true);
        setErrors({});
        setFailure(null);

        const xsrfToken = readCookie('XSRF-TOKEN');

        // Not Inertia's router.post: this is the one place in the app
        // where the visitor transitions from unauthenticated to
        // authenticated mid-request. A hard redirect afterwards guarantees
        // the freshly-issued session cookie is fully in place before the
        // member-portal dashboard's own data fetch fires, rather than
        // racing an SPA-style follow-up request against it.
        try {
            const response = await fetch(
                window.location.pathname + window.location.search,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify({
                        password,
                        password_confirmation: passwordConfirmation,
                    }),
                },
            );

            if (response.ok) {
                window.location.href = '/member-portal';

                return;
            }

            if (response.status === 422) {
                const json = await response.json();
                setErrors(json.errors ?? {});
            } else if (response.status === 403 || response.status === 404) {
                // Signature expired/invalid, or the invitation was already
                // accepted (account no longer in the "invited" state).
                setLinkInvalid(true);
            } else if (response.status === 419 || response.status === 401) {
                // CSRF token or session problem, not an expired invitation -
                // the emailed link itself may still be perfectly valid.
                setFailure('session');
            } else {
                console.error('Unexpected invitation accept response', response.status);
                setFailure('session');
            }
        } catch (error) {
            console.error('Invitation accept request failed', error);
            setFailure('network');
        } finally {
            setProcessing(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-6">
            <Head title="Set up your member portal" />

            <div className="w-full max-w-sm space-y-6">
                <div className="flex flex-col items-center gap-3 text-center">
                    {gymLogoUrl ? (
                        <img
                            src={gymLogoUrl}
                            alt={gymName ?? 'Gym logo'}
                            className="h-14 w-14 rounded-lg object-contain"
                        />
                    ) : null}
                    {gymName && (
                        <p className="text-sm font-medium text-muted-foreground">
                            {gymName}
                        </p>
                    )}
                    <h1 className="text-xl font-semibold">
                        Set up your member portal
                    </h1>
                    {!linkInvalid && (
                        <p className="text-sm text-muted-foreground">
                            Welcome, {name}. Set a password for {email} to
                            get started.
                        </p>
                    )}
                </div>

                {linkInvalid && (
                    <p className="text-center text-sm text-destructive">
                        {FAILURE_MESSAGES.expired}
                    </p>
                )}

                {!linkInvalid && failure && (
                    <p className="text-center text-sm text-destructive">
                        {FAILURE_MESSAGES[failure]}
                    </p>
                )}

                {!linkInvalid && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <PasswordInput
                                id="password"
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
                            <PasswordInput
                                id="password_confirmation"
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
