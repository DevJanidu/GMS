import { Bell } from 'lucide-react';
import type { ModuleNavigation } from '@/types';

export const navigation: ModuleNavigation = {
    title: 'Notifications',
    href: '/notifications',
    icon: Bell,
    order: 70,
    group: 'Administration',
    children: [
        {
            title: 'Notification Center',
            href: '/notifications',
            permission: 'notifications.center.view',
        },
        {
            title: 'Templates',
            href: '/notifications/templates',
            permission: 'notifications.templates.view',
        },
        {
            title: 'Rules',
            href: '/notifications/rules',
            permission: 'notifications.rules.view',
        },
        {
            title: 'Delivery Logs',
            href: '/notifications/logs',
            permission: 'notifications.logs.view',
        },
        {
            title: 'Manual Announcements',
            href: '/notifications/announcements',
            permission: 'notifications.announcements.view',
        },
    ],
};
