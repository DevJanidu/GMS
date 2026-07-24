import { Link, usePage } from '@inertiajs/react';
import {
    filterNavigationForUser,
    getModuleNavigation,
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

    const mainItems = navigation.filter((item) => item.group !== 'settings');
    const settingsItems = navigation.filter(
        (item) => item.group === 'settings',
    );

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
                <NavMain items={mainItems} />

                <div className="mt-auto">
                    <SidebarSeparator className="mx-0" />
                    <NavMain items={settingsItems} label="Settings" />
                </div>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
