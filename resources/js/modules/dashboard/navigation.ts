import { LayoutDashboard } from 'lucide-react';
import { dashboard } from '@/routes';
import type { ModuleNavigation } from '@/types';

export const navigation: ModuleNavigation = {
    title: 'Operational Dashboard',
    href: dashboard(),
    icon: LayoutDashboard,
    order: 10,
    group: 'Dashboard',
    permission: 'dashboard.view',
};
