import type { ReactNode } from 'react';
import { ErrorState } from '@/components/shared/error-state';
import { PermissionGate } from '@/components/shared/permission-gate';
import type { PermissionRequirement } from '@/lib/permissions/can';

export function ProtectedRoute({
    permission,
    children,
}: {
    permission: PermissionRequirement;
    children: ReactNode;
}) {
    return (
        <PermissionGate
            permission={permission}
            fallback={
                <div className="p-6">
                    <ErrorState
                        title="Access denied"
                        description="You do not have permission to view this page. Contact an administrator if you need access."
                    />
                </div>
            }
        >
            {children}
        </PermissionGate>
    );
}
