import type { User } from '@/types';

export type PermissionRequirement = string | string[];

/**
 * `permissions` is always sent by the backend now (see
 * HandleInertiaRequests::share), so a missing array means an anonymous or
 * stale session rather than "unrestricted" — fail closed rather than open.
 *
 * When `permission` is an array, access is granted if the user holds *any*
 * one of the listed permissions.
 */
export function can(
    user: User | null | undefined,
    permission?: PermissionRequirement,
): boolean {
    if (!permission || (Array.isArray(permission) && permission.length === 0)) {
        return true;
    }

    const granted = user?.permissions;

    if (!granted) {
        return false;
    }

    if (granted.includes('*')) {
        return true;
    }

    const required = Array.isArray(permission) ? permission : [permission];

    return required.some((slug) => granted.includes(slug));
}
