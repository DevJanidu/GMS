import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthGymLayout from '@/layouts/auth/auth-gym-layout';
import SettingsLayout from '@/layouts/settings/layout';
import MemberPortalLayout from '@/modules/member-portal/layouts/member-portal-layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            // Pre-auth invitation pages render their own bare, centered
            // layout (see e.g. staff/accept-invitation.tsx's `.layout =
            // (page) => page`) — the visitor isn't signed in yet, so
            // wrapping them in AppLayout/MemberPortalLayout would render a
            // broken shell (empty user widget, an auth-gated nav) around
            // the actual set-password form.
            case name.endsWith('/accept-invitation'):
                return undefined;
            // Every auth screen (login, forgot/reset password, verify
            // email, 2FA challenge, confirm password) shares the branded
            // gym layout — a visitor bouncing from login to "forgot
            // password" shouldn't land on a plain unstyled page.
            case name.startsWith('auth/'):
                return AuthGymLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            case name.startsWith('member-portal/'):
                return MemberPortalLayout;
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
