import { ShieldCheck } from 'lucide-react';
import roles from '@/routes/roles';
import type { NavItem } from '@/types';

export const navigation: NavItem = {
    title: 'Roles',
    href: roles.index(),
    icon: ShieldCheck,
    permission: 'roles.view',
};
