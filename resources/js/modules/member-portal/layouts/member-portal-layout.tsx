import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    CalendarCheck,
    CreditCard,
    House,
    IdCard,
    LogOut,
    MoreHorizontal,
    ReceiptText,
    UserRound,
    WalletCards,
} from 'lucide-react';
import { useState } from 'react';
import type { ComponentType, ReactNode } from 'react';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

type NavItem = {
    label: string;
    href: string;
    icon: ComponentType<{ className?: string }>;
};

const items: NavItem[] = [
    { label: 'Dashboard', href: '/member-portal', icon: House },
    { label: 'QR Card', href: '/member-portal/qr-card', icon: IdCard },
    { label: 'Membership', href: '/member-portal/membership', icon: WalletCards },
    { label: 'Payments', href: '/member-portal/payments', icon: CreditCard },
    { label: 'Receipts', href: '/member-portal/receipts', icon: ReceiptText },
    { label: 'Attendance', href: '/member-portal/attendance', icon: CalendarCheck },
    { label: 'Notifications', href: '/member-portal/notifications', icon: Bell },
    { label: 'Profile', href: '/member-portal/profile', icon: UserRound },
];

// Primary tabs shown in the mobile bottom bar; everything else (plus
// account actions) lives behind the "More" sheet so the bar stays a
// comfortable, thumb-reachable 5 items on a phone.
const primaryMobileItems = items.filter((item) =>
    ['/member-portal', '/member-portal/qr-card', '/member-portal/attendance', '/member-portal/profile'].includes(
        item.href,
    ),
);
const moreMobileItems = items.filter(
    (item) => !primaryMobileItems.includes(item),
);

function isActiveHref(currentPath: string, href: string): boolean {
    const normalizedHref = href.replace(/\/$/, '');

    return (
        currentPath === normalizedHref ||
        (normalizedHref !== '/member-portal' &&
            currentPath.startsWith(`${normalizedHref}/`))
    );
}

function DesktopNav() {
    const currentPath = usePage().url.split('?')[0].replace(/\/$/, '');

    return (
        <nav
            aria-label="Member portal"
            className="hidden items-center gap-1 lg:flex"
        >
            {items.map(({ label, href, icon: Icon }) => {
                const active = isActiveHref(currentPath, href);

                return (
                    <Link
                        key={href}
                        href={href}
                        prefetch
                        className={cn(
                            'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            active
                                ? 'bg-portal-accent text-portal-accent-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )}
                    >
                        <Icon className="size-4" />
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}

function MobileBottomNav() {
    const currentPath = usePage().url.split('?')[0].replace(/\/$/, '');
    const [moreOpen, setMoreOpen] = useState(false);
    const moreActive = moreMobileItems.some((item) =>
        isActiveHref(currentPath, item.href),
    );

    return (
        <nav
            aria-label="Member portal"
            className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
        >
            <div className="mx-auto flex h-16 max-w-lg items-stretch">
                {primaryMobileItems.map(({ label, href, icon: Icon }) => {
                    const active = isActiveHref(currentPath, href);

                    return (
                        <Link
                            key={href}
                            href={href}
                            prefetch
                            className={cn(
                                'flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium',
                                active
                                    ? 'text-portal-accent'
                                    : 'text-muted-foreground',
                            )}
                        >
                            <Icon className="size-5" />
                            {label}
                        </Link>
                    );
                })}

                <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
                    <SheetTrigger asChild>
                        <button
                            type="button"
                            className={cn(
                                'flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium',
                                moreOpen || moreActive
                                    ? 'text-portal-accent'
                                    : 'text-muted-foreground',
                            )}
                        >
                            <MoreHorizontal className="size-5" />
                            More
                        </button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="p-4 pb-8">
                        <SheetTitle className="mb-2">
                            More
                        </SheetTitle>
                        <div className="grid grid-cols-2 gap-2">
                            {moreMobileItems.map(({ label, href, icon: Icon }) => {
                                const active = isActiveHref(currentPath, href);

                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        prefetch
                                        onClick={() => setMoreOpen(false)}
                                        className={cn(
                                            'flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                            active
                                                ? 'bg-portal-accent text-portal-accent-foreground'
                                                : 'bg-muted/60 text-foreground hover:bg-muted',
                                        )}
                                    >
                                        <Icon className="size-4 shrink-0" />
                                        {label}
                                    </Link>
                                );
                            })}
                        </div>
                        <Button
                            variant="outline"
                            className="mt-2 min-h-11 w-full"
                            asChild
                        >
                            <Link href="/logout" method="post" as="button">
                                <LogOut />
                                Log out
                            </Link>
                        </Button>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}

export default function MemberPortalLayout({
    children,
}: {
    children: ReactNode;
}) {
    const { auth, gym } = usePage().props;

    return (
        <div className="min-h-screen bg-muted/20">
            <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-4 px-4 sm:px-6">
                    <Link href="/member-portal" className="min-w-0 shrink">
                        <AppLogo />
                    </Link>

                    <DesktopNav />

                    <div className="ml-auto flex items-center gap-2">
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-medium">
                                {auth.user.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {gym?.name ?? 'Member account'}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="hidden min-h-9 lg:inline-flex"
                            asChild
                        >
                            <Link href="/logout" method="post" as="button">
                                <LogOut />
                                <span className="hidden sm:inline">Log out</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
                {children}
            </main>

            <MobileBottomNav />
        </div>
    );
}
