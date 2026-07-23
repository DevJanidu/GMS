import { RefreshCwIcon } from 'lucide-react';
import RenewalDashboardController from '@/actions/App/Modules/Membership/Controllers/RenewalDashboardController';
import type { NavItem } from '@/types';

export const navigation: NavItem = {
    title: 'Renewals',
    href: RenewalDashboardController.index.url(),
    icon: RefreshCwIcon,
    permission: 'memberships.view',
    order: 41,
};
