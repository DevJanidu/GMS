import { UserCog } from 'lucide-react';
import staff from '@/routes/staff';
import type { ModuleNavigation } from '@/types';

export const navigation: ModuleNavigation = {
    title: 'Staff',
    href: staff.index(),
    icon: UserCog,
    permission: 'staff.view',
    order: 30,
};
