import { UserCog } from 'lucide-react';
import staff from '@/routes/staff';
import type { ModuleNavigation } from '@/types';

export const navigation: ModuleNavigation = {
    title: 'Staff & Roles',
    href: staff.index(),
    icon: UserCog,
    permission: 'staff.view',
    order: 60,
    group: 'Administration',
};
