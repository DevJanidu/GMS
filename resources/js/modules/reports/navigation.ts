import { BarChart3, FileClock, ScrollText } from 'lucide-react';
import type { ModuleNavigation } from '@/types';
import { reportDefinitions } from './report-definitions';

export const navigation: ModuleNavigation = [
    {
        title: 'Reports',
        href: '/reports',
        icon: BarChart3,
        order: 50,
        group: 'Insights',
        permission: 'reports.view',
        children: [
            {
                title: 'Report Catalogue',
                href: '/reports',
                permission: 'reports.view',
            },
            ...reportDefinitions.map((report) => ({
                title: report.title,
                href: `/reports/${report.key}`,
                permission: report.permission,
            })),
        ],
    },
    {
        title: 'Export History',
        href: '/exports',
        icon: FileClock,
        order: 71,
        group: 'Administration',
        permission: 'exports.create',
    },
    {
        title: 'Audit Logs',
        href: '/audit',
        icon: ScrollText,
        order: 72,
        group: 'Administration',
        permission: 'audit.view',
    },
];
