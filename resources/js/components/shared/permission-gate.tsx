import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import type { PermissionRequirement } from '@/lib/permissions/can';
import { can } from '@/lib/permissions/can';

export function PermissionGate({
    permission,
    children,
    fallback = null,
}: {
    permission: PermissionRequirement;
    children: ReactNode;
    fallback?: ReactNode;
}) {
    const { auth } = usePage().props;

    return can(auth.user, permission) ? children : fallback;
}
