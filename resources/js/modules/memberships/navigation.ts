import { IdCardIcon } from 'lucide-react';
import MembershipController from '@/actions/App/Modules/Membership/Controllers/MembershipController';
import { navigation as plans } from '@/modules/plans/nav-item';
import { navigation as renewals } from '@/modules/renewals/nav-item';
import type { ModuleNavigation } from '@/types';

// No permission on the parent: each child keeps its own gate (Active
// Memberships/Renewals require memberships.view, Membership Plans has none),
// so this group must stay visible to a user who can see any one of them.
export const navigation: ModuleNavigation = {
    title: 'Memberships',
    href: MembershipController.index.url(),
    icon: IdCardIcon,
    order: 21,
    group: 'Member Management',
    children: [
        {
            title: 'Active Memberships',
            href: MembershipController.index.url(),
            icon: IdCardIcon,
            permission: 'memberships.view',
        },
        plans,
        renewals,
    ],
};
