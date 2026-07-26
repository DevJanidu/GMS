import { BarChart3 } from 'lucide-react';
import type { ModuleNavigation } from '@/types';

export const navigation: ModuleNavigation = {
    title: 'Reports & Analytics',
    href: '/reports',
    icon: BarChart3,
    order: 50,
    group: 'Insights',
    permission: 'reports.view',
};
