import { Settings2, User } from 'lucide-react';
import { navigation as branches } from '@/modules/branches/nav-item';
import { navigation as roles } from '@/modules/roles/nav-item';
import { edit as editProfile } from '@/routes/profile';
import type { ModuleNavigation } from '@/types';

// Profile has no permission requirement — every authenticated user manages
// their own account regardless of gym-level permissions. Branches/Roles
// keep their own permission checks so they only show up for users who can
// access them.
export const navigation: ModuleNavigation = {
    title: 'Gym Settings',
    href: editProfile(),
    icon: Settings2,
    order: 999,
    group: 'settings',
    children: [
        { title: 'Profile', href: editProfile(), icon: User },
        branches,
        roles,
    ],
};
