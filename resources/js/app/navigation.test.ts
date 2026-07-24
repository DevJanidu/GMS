import { describe, expect, it } from 'vitest';
import type { NavItem, User } from '@/types';
import { filterNavigationForUser } from './navigation';

function user(permissions: string[]): User {
    return { permissions } as unknown as User;
}

const items: NavItem[] = [
    {
        title: 'Notifications',
        href: '/notifications',
        children: [
            {
                title: 'Center',
                href: '/notifications',
                permission: 'notifications.center.view',
            },
            {
                title: 'Templates',
                href: '/notifications/templates',
                permission: 'notifications.templates.view',
            },
        ],
    },
    {
        title: 'Reports',
        href: '/reports',
        permission: 'reports.view',
    },
];

describe('filterNavigationForUser', () => {
    it('removes unauthorized children while preserving an authorized sibling', () => {
        const result = filterNavigationForUser(
            items,
            user(['notifications.center.view']),
        );

        expect(result).toHaveLength(1);
        expect(result[0].children?.map((child) => child.title)).toEqual([
            'Center',
        ]);
    });

    it('hides a parent when every child is unauthorized', () => {
        expect(filterNavigationForUser(items, user([]))).toEqual([]);
    });

    it('preserves all navigation for the owner wildcard', () => {
        expect(filterNavigationForUser(items, user(['*']))).toEqual(items);
    });
});
