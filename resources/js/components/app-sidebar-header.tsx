import { Bell, Building2, Moon, Search, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
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
import { branchesApi } from '@/modules/branches/api/branches';
import type { Branch } from '@/modules/branches/types';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

const ALL_BRANCHES = 'all';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedBranch, setSelectedBranch] = useState(ALL_BRANCHES);

    useEffect(() => {
        branchesApi
            .list({ status: 'active' })
            .then((response) => setBranches(response.data))
            .catch(() => setBranches([]));
    }, []);

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-sidebar-border/50 bg-background/90 px-4 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 sm:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <div className="hidden sm:block">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>
            <div className="hidden flex-1 justify-center lg:flex">
                <div className="relative w-full max-w-xs">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                        className="bg-muted/50 h-9 pl-9"
                        placeholder="Search members, payments..."
                        aria-label="Global search"
                    />
                </div>
            </div>
            <div className="flex flex-1 items-center justify-end gap-2">
                <Select
                    value={selectedBranch}
                    onValueChange={setSelectedBranch}
                >
                    <SelectTrigger
                        className="hidden w-60 md:flex"
                        aria-label="Select branch"
                    >
                        <Building2 className="size-4 text-emerald-500" />
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL_BRANCHES}>
                            All branches
                        </SelectItem>
                        {branches.map((branch) => (
                            <SelectItem
                                key={branch.id}
                                value={String(branch.id)}
                            >
                                {branch.name}
                            </SelectItem>
                        ))}
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
