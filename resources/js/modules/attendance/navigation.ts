import { Camera, History, UserCheck } from 'lucide-react';
import attendance from '@/routes/attendance';
import type { ModuleNavigation } from '@/types';

export const navigation: ModuleNavigation = {
    title: 'Attendance',
    href: attendance.manual.url(),
    icon: Camera,
    order: 30,
    group: 'Operations',
    children: [
        {
            title: 'Member Check-In',
            href: attendance.manual.url(),
            icon: UserCheck,
            permission: 'attendance.manual',
        },
        {
            title: 'Attendance History',
            href: attendance.history.url(),
            icon: History,
            permission: 'attendance.history.view',
        },
    ],
};
