import { Building2 } from 'lucide-react';
import branches from '@/routes/branches';
import type { NavItem } from '@/types';

export const navigation: NavItem = {
    title: 'Branches',
    href: branches.index(),
    icon: Building2,
    permission: 'branches.view',
};
