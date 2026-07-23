import type { ModuleNavigation, NavItem } from '@/types';

type NavigationModule = {
    navigation: ModuleNavigation;
};

const modules = import.meta.glob<NavigationModule>(
    '../modules/*/navigation.ts',
    { eager: true },
);

export function getModuleNavigation(): NavItem[] {
    return Object.values(modules)
        .flatMap(({ navigation }) =>
            Array.isArray(navigation) ? navigation : [navigation],
        )
        .sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
}
