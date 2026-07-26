import { Camera, History, Settings, UserCheck, Users } from 'lucide-react';
import attendance from '@/routes/attendance';
import type { ModuleNavigation } from '@/types';

export const navigation: ModuleNavigation = {
    title: 'Attendance',
    href: attendance.live.url(),
    icon: Camera,
    order: 45,
    group: 'Operations',
    children: [
        {
            title: 'QR Scanner',
            href: attendance.scanner.url(),
            icon: Camera,
            permission: 'attendance.scan',
        },
        {
            title: 'Manual Check-in',
            href: attendance.manual.url(),
            icon: UserCheck,
            permission: 'attendance.manual',
        },
        {
            title: 'Live Attendance',
            href: attendance.live.url(),
            icon: Users,
            permission: 'attendance.live.view',
        },
        {
            title: 'Attendance History',
            href: attendance.history.url(),
            icon: History,
            permission: 'attendance.history.view',
        },
        {
            title: 'Attendance Settings',
            href: attendance.settings.url(),
            icon: Settings,
            permission: 'attendance.settings.view',
        },
    ],
};
