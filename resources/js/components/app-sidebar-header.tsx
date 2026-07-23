import { Bell, Building2, Dumbbell, Moon, Search, Sun } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAppearance } from '@/hooks/use-appearance';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-sidebar-border/50 bg-background/90 px-4 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 sm:px-6">
            <div className="flex min-w-0 items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <div className="hidden sm:block">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>
            <div className="flex flex-1 items-center justify-end gap-2">
                <div className="relative hidden w-full max-w-xs lg:block">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                        className="bg-muted/50 h-9 pl-9"
                        placeholder="Search members, payments..."
                        aria-label="Global search"
                    />
                </div>
                <Select defaultValue="pulse">
                    <SelectTrigger
                        className="hidden w-36 xl:flex"
                        aria-label="Select tenant"
                    >
                        <Dumbbell className="size-4 text-primary" />
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pulse">Pulse Fitness</SelectItem>
                        <SelectItem value="demo">Demo Gym</SelectItem>
                    </SelectContent>
                </Select>
                <Select defaultValue="colombo">
                    <SelectTrigger
                        className="hidden w-44 md:flex"
                        aria-label="Select branch"
                    >
                        <Building2 className="size-4 text-emerald-500" />
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="colombo">Colombo Central</SelectItem>
                        <SelectItem value="kandy">Kandy City</SelectItem>
                        <SelectItem value="all">All branches</SelectItem>
                    </SelectContent>
                </Select>
                <ThemeButton />
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label="Notifications"
                >
                    <Bell />
                    <span className="absolute top-2 right-2 size-1.5 rounded-full bg-orange-500 ring-2 ring-background" />
                </Button>
            </div>
        </header>
    );
}

function ThemeButton() {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => updateAppearance(isDark ? 'light' : 'dark')}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            {isDark ? <Sun /> : <Moon />}
        </Button>
    );
}
