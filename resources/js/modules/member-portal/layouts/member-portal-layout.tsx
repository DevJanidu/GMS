import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    CalendarCheck,
    CreditCard,
    House,
    IdCard,
    LogOut,
    Menu,
    ReceiptText,
    UserRound,
    WalletCards,
} from 'lucide-react';
import type { ReactNode } from 'react';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const items = [
    { label: 'Dashboard', href: '/member-portal', icon: House },
    { label: 'QR Card', href: '/member-portal/qr-card', icon: IdCard },
    { label: 'Membership', href: '/member-portal/membership', icon: WalletCards },
    { label: 'Payments', href: '/member-portal/payments', icon: CreditCard },
    { label: 'Receipts', href: '/member-portal/receipts', icon: ReceiptText },
    { label: 'Attendance', href: '/member-portal/attendance', icon: CalendarCheck },
    { label: 'Notifications', href: '/member-portal/notifications', icon: Bell },
    { label: 'Profile', href: '/member-portal/profile', icon: UserRound },
];

function PortalLinks({ mobile = false }: { mobile?: boolean }) {
    const currentPath = usePage().url.split('?')[0].replace(/\/$/, '');

    return (
        <nav
            aria-label="Member portal"
            className={cn(
                mobile ? 'grid gap-1' : 'hidden items-center gap-1 lg:flex',
            )}
        >
            {items.map(({ label, href, icon: Icon }) => {
                const normalizedHref = href.replace(/\/$/, '');
                const active =
                    currentPath === normalizedHref ||
                    (normalizedHref !== '/member-portal' &&
                        currentPath.startsWith(`${normalizedHref}/`));

                return (
                    <Link
                        key={href}
                        href={href}
                        prefetch
                        className={cn(
                            'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            active
                                ? 'bg-emerald-600 text-white'
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
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                aria-label="Open member navigation"
                            >
                                <Menu />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-72 p-4">
                            <SheetTitle className="mb-6">
                                Member navigation
                            </SheetTitle>
                            <PortalLinks mobile />
                        </SheetContent>
                    </Sheet>

                    <Link href="/member-portal" className="shrink-0">
                        <AppLogo />
                    </Link>

                    <PortalLinks />

                    <div className="ml-auto flex items-center gap-2">
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-medium">
                                {auth.user.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {gym?.name ?? 'Member account'}
                            </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/logout" method="post" as="button">
                                <LogOut />
                                <span className="hidden sm:inline">Log out</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
}
