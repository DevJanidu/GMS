import { IdCardIcon } from 'lucide-react';
import MembershipController from '@/actions/App/Modules/Membership/Controllers/MembershipController';
import type { NavItem } from '@/types';

export const navigation: NavItem = {
    title: 'Memberships',
    href: MembershipController.index.url(),
    icon: IdCardIcon,
    permission: 'memberships.view',
    order: 40,
};
