import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-black/30">
                <AppLogoIcon className="size-5 fill-current" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-bold">
                    Pulse GMS
                </span>
                <span className="text-sidebar-foreground/60 truncate text-[11px]">
                    Gym management
                </span>
            </div>
        </>
    );
}
