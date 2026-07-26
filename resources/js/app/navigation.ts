import { can } from '@/lib/permissions/can';
import type { ModuleNavigation, NavItem, User } from '@/types';

type NavigationModule = {
    navigation: ModuleNavigation;
};

const modules = import.meta.glob<NavigationModule>(
    '../modules/**/navigation.ts',
    { eager: true },
);

export const SIDEBAR_SECTIONS = [
    'Overview',
    'Member Management',
    'Operations',
    'Finance',
    'Insights',
    'Administration',
] as const;

export type SidebarSection = (typeof SIDEBAR_SECTIONS)[number];

export type NavSectionGroup = {
    section: SidebarSection;
    items: NavItem[];
};

export function getModuleNavigation(): NavItem[] {
    return Object.values(modules)
        .flatMap(({ navigation }) =>
            Array.isArray(navigation) ? navigation : [navigation],
        )
        .sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
}

export function filterNavigationForUser(
    items: NavItem[],
    user: User | null | undefined,
): NavItem[] {
    return items
        .filter((item) => can(user, item.permission))
        .map((item) => ({
            ...item,
            children: item.children?.filter((child) =>
                can(user, child.permission),
            ),
        }))
        .filter(
            (item) =>
                item.children === undefined || item.children.length > 0,
        );
}

export function groupNavigationBySection(
    items: NavItem[],
): NavSectionGroup[] {
    return SIDEBAR_SECTIONS.map((section) => ({
        section,
        items: items.filter((item) => item.group === section),
    })).filter((group) => group.items.length > 0);
}
