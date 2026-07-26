import { CreditCardIcon } from 'lucide-react';
import PlanController from '@/actions/App/Http/Controllers/PlanController';
import type { NavItem } from '@/types';

export const navigation: NavItem = {
    title: 'Membership Plans',
    href: PlanController.index.url(),
    icon: CreditCardIcon,
};
