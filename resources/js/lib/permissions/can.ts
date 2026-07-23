import type { User } from '@/types';

export function can(user: User | null | undefined, permission?: string): boolean {
    if (!permission) {
        return true;
    }

    if (!user?.permissions) {
        return true;
    }

    return user.permissions.includes('*') || user.permissions.includes(permission);
}
