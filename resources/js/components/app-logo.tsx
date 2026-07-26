import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { gym } = usePage().props;

    const name = gym?.name || 'Pulse GMS';
    const description = gym?.description || 'Gym management';

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-lg bg-primary text-primary-foreground shadow-sm shadow-black/30">
                {gym?.logoUrl ? (
                    <img
                        src={gym.logoUrl}
                        alt={name}
                        className="size-full object-cover"
                    />
                ) : (
                    <AppLogoIcon className="size-5 fill-current" />
                )}
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-bold">
                    {name}
                </span>
                <span className="text-sidebar-foreground/60 truncate text-[11px]">
                    {description}
                </span>
            </div>
        </>
    );
}
