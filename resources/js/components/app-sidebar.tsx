import { Link, usePage } from '@inertiajs/react';
import {
    filterNavigationForUser,
    getModuleNavigation,
    groupNavigationBySection,
} from '@/app/navigation';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';

export function AppSidebar() {
    const { auth } = usePage().props;
    const navigation = filterNavigationForUser(
        getModuleNavigation(),
        auth.user,
    );

    const sections = groupNavigationBySection(navigation);
    const lastSection = sections[sections.length - 1];
    const leadingSections = sections.slice(0, -1);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {leadingSections.map((group) => (
                    <NavMain
                        key={group.section}
                        items={group.items}
                        label={group.section}
                    />
                ))}

                {lastSection && (
                    <div className="mt-auto">
                        <SidebarSeparator className="mx-0" />
                        <NavMain
                            items={lastSection.items}
                            label={lastSection.section}
                        />
                    </div>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
