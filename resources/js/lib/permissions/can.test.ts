import { describe, expect, it } from 'vitest';
import type { User } from '@/types';
import { can } from './can';

function userWith(permissions: string[]): User {
    return {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        email_verified_at: null,
        created_at: '',
        updated_at: '',
        permissions,
    };
}

describe('can', () => {
    it('allows access when no permission is required', () => {
        expect(can(userWith([]))).toBe(true);
        expect(can(undefined)).toBe(true);
    });

    it('fails closed when the user has no permissions array at all', () => {
        const userWithoutPermissions = {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            email_verified_at: null,
            created_at: '',
            updated_at: '',
        } as User;

        expect(can(userWithoutPermissions, 'members.view')).toBe(false);
        expect(can(null, 'members.view')).toBe(false);
    });

    it('grants everything to a wildcard (owner) permission set', () => {
        const owner = userWith(['*']);

        expect(can(owner, 'members.view')).toBe(true);
        expect(can(owner, 'anything.at.all')).toBe(true);
    });

    it('grants access only for a matching permission slug', () => {
        const user = userWith(['members.view']);

        expect(can(user, 'members.view')).toBe(true);
        expect(can(user, 'members.delete')).toBe(false);
    });

    it('grants access when any permission in a list matches', () => {
        const user = userWith(['dashboard.view']);

        expect(can(user, ['dashboard.financials.view', 'dashboard.view'])).toBe(
            true,
        );
        expect(can(user, ['dashboard.financials.view', 'billing.view'])).toBe(
            false,
        );
    });
});
