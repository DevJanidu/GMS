import { Link } from '@inertiajs/react';
import { Building2, TrendingUp, Users2 } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

const HIGHLIGHTS = [
    {
        icon: Users2,
        label: 'Members',
        description: 'Track every member, plan, and payment in one place.',
    },
    {
        icon: Building2,
        label: 'Branches',
        description: 'Run every location from a single dashboard.',
    },
    {
        icon: TrendingUp,
        label: 'Growth',
        description: 'Real-time insight into check-ins, revenue, and retention.',
    },
];

export default function AuthGymLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="dark relative grid min-h-svh overflow-hidden bg-gradient-to-br from-emerald-950 via-zinc-950 to-black text-foreground lg:grid-cols-2">
            <div className="pointer-events-none absolute -top-32 -left-32 size-[32rem] rounded-full bg-emerald-500/25 blur-3xl" />
            <div className="pointer-events-none absolute top-1/3 -right-40 size-[28rem] rounded-full bg-orange-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 left-1/4 size-[26rem] rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative z-10 hidden flex-col justify-between p-10 lg:flex">
                <Link
                    href={home()}
                    className="flex items-center gap-2 text-lg font-semibold text-white"
                >
                    <span className="flex size-10 items-center justify-center rounded-xl bg-white/10">
                        <AppLogoIcon className="size-6 fill-current text-emerald-400" />
                    </span>
                    Pulse GMS
                </Link>

                <div className="space-y-6">
                    <h2 className="max-w-md text-4xl leading-tight font-semibold text-balance text-white">
                        Run your gym like{' '}
                        <span className="text-emerald-400">a pro.</span>
                    </h2>
                    <p className="max-w-sm text-white/70">
                        Members, staff, branches, and plans — all in one
                        place, built for gyms that mean business.
                    </p>

                    <div className="space-y-4 pt-4">
                        {HIGHLIGHTS.map(({ icon: Icon, label, description: highlightDescription }) => (
                            <div key={label} className="flex items-start gap-3">
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                                    <Icon className="size-4 text-emerald-400" />
                                </span>
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        {label}
                                    </p>
                                    <p className="text-sm text-white/60">
                                        {highlightDescription}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-xs text-white/40">
                    &copy; {new Date().getFullYear()} Pulse GMS &mdash; built
                    for gyms that never skip leg day.
                </p>
            </div>

            <div className="relative z-10 flex items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-xl space-y-6">
                    <Link
                        href={home()}
                        className="flex items-center justify-center gap-2 text-white lg:hidden"
                    >
                        <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10">
                            <AppLogoIcon className="size-5 fill-current text-emerald-500" />
                        </span>
                        <span className="text-lg font-semibold">
                            Pulse GMS
                        </span>
                    </Link>

                    <div className="auth-glass-card rounded-3xl border border-white/15 bg-white/10 p-10 shadow-2xl backdrop-blur-xl sm:p-12">
                        <div className="mb-8 space-y-2 text-center lg:text-left">
                            <h1 className="text-3xl font-semibold tracking-tight text-white">
                                {title}
                            </h1>
                            <p className="text-base text-white/70">
                                {description}
                            </p>
                        </div>

                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
