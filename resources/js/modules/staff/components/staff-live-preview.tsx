import { Briefcase, Building2, Mail, Phone, Shield, User as UserIcon } from 'lucide-react';
import { DetailRow } from '@/components/detail-row';
import { PreviewCard } from '@/components/live-preview/preview-card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { StaffInvitePreviewValues } from '@/modules/staff/components/staff-invite-form';

function initialsOf(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
        return '';
    }

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

export function StaffLivePreview({
    values,
}: {
    values: StaffInvitePreviewValues;
}) {
    const initials = initialsOf(values.name);

    const branchesLabel = values.branches.length
        ? values.branches
              .map((branch) =>
                  branch.id === values.primaryBranchId
                      ? `${branch.name} (Primary)`
                      : branch.name,
              )
              .join(', ')
        : null;

    return (
        <PreviewCard>
            <Avatar className="size-28 border">
                <AvatarFallback className="text-2xl">
                    {initials || (
                        <UserIcon className="size-10 text-muted-foreground" />
                    )}
                </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
                <p className="text-lg font-semibold">
                    {values.name || 'New staff member'}
                </p>
                <Badge variant="secondary">Pending invitation</Badge>
            </div>

            <div className="w-full space-y-4 border-t pt-4 text-left">
                <DetailRow
                    icon={<Mail className="size-4" />}
                    label="Email"
                    value={values.email || null}
                />
                <DetailRow
                    icon={<Phone className="size-4" />}
                    label="Phone"
                    value={values.phone || null}
                />
                <DetailRow
                    icon={<Briefcase className="size-4" />}
                    label="Job title"
                    value={values.jobTitle || null}
                />
                <DetailRow
                    icon={<Shield className="size-4" />}
                    label="Role"
                    value={values.role?.name ?? null}
                />
                <DetailRow
                    icon={<Building2 className="size-4" />}
                    label="Branches"
                    value={branchesLabel}
                />
            </div>
        </PreviewCard>
    );
}
