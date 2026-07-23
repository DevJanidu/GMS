import { UsersIcon } from 'lucide-react';
import MemberController from '@/actions/App/Http/Controllers/MemberController';
import type { NavItem } from '@/types';

export const navigation: NavItem = {
    title: 'Members',
    href: MemberController.index.url(),
    icon: UsersIcon,
};
