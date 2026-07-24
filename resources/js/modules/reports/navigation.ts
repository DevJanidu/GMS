import { BarChart3, FileClock, ScrollText } from 'lucide-react';
import type { ModuleNavigation } from '@/types';
import { reportDefinitions } from './report-definitions';

export const navigation: ModuleNavigation = [
    {
        title: 'Reports',
        href: '/reports',
        icon: BarChart3,
        order: 80,
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
        order: 81,
        group: 'Insights',
        permission: 'exports.create',
    },
    {
        title: 'Audit Logs',
        href: '/audit',
        icon: ScrollText,
        order: 82,
        group: 'Insights',
        permission: 'audit.view',
    },
];
