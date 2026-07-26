import {
    Building2,
    Cake,
    Calendar,
    Mail,
    MapPin,
    Phone,
    ShieldAlert,
    StickyNote,
    User as UserIcon,
    VenusAndMars,
} from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { DetailRow } from '@/components/detail-row';
import { PreviewCard } from '@/components/live-preview/preview-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { MemberFormData } from '@/modules/members/components/member-form';
import type { BranchOption } from '@/modules/members/types';

const GENDER_LABELS: Record<string, string> = {
    male: 'Male',
    female: 'Female',
    other: 'Other',
    prefer_not_to_say: 'Prefer not to say',
};

function initialsOf(firstName: string, lastName: string): string {
    const initials = `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase();

    return initials || 'NM';
}

export function MemberLivePreview({
    data,
    branches,
}: {
    data: MemberFormData;
    branches: BranchOption[];
}) {
    const photoUrl = useMemo(
        () => (data.photo ? URL.createObjectURL(data.photo) : null),
        [data.photo],
    );

    useEffect(() => {
        return () => {
            if (photoUrl) {
                URL.revokeObjectURL(photoUrl);
            }
        };
    }, [photoUrl]);

    const fullName = [data.first_name, data.last_name]
        .filter(Boolean)
        .join(' ')
        .trim();

    const branchName = branches.find(
        (branch) => String(branch.id) === data.branch_id,
    )?.name;

    const genderLabel = data.gender ? GENDER_LABELS[data.gender] : null;

    const emergencyContact = [
        data.emergency_contact_name,
        data.emergency_contact_phone,
    ]
        .filter(Boolean)
        .join(' — ');

    return (
        <PreviewCard>
            <Avatar className="size-28 border">
                {photoUrl && (
                    <AvatarImage src={photoUrl} alt={fullName || 'Member photo'} />
                )}
                <AvatarFallback className="text-2xl">
                    {data.first_name || data.last_name ? (
                        initialsOf(data.first_name, data.last_name)
                    ) : (
                        <UserIcon className="size-10 text-muted-foreground" />
                    )}
                </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
                <p className="text-lg font-semibold">{fullName || 'New member'}</p>
                {branchName && (
                    <Badge variant="secondary" className="gap-1">
                        <Building2 className="size-3" />
                        {branchName}
                    </Badge>
                )}
            </div>

            <div className="w-full space-y-4 border-t pt-4 text-left">
                <DetailRow
                    icon={<Mail className="size-4" />}
                    label="Email"
                    value={data.email || null}
                />
                <DetailRow
                    icon={<Phone className="size-4" />}
                    label="Phone"
                    value={data.phone || null}
                />
                <DetailRow
                    icon={<VenusAndMars className="size-4" />}
                    label="Gender"
                    value={genderLabel}
                />
                <DetailRow
                    icon={<Cake className="size-4" />}
                    label="Date of birth"
                    value={data.date_of_birth || null}
                />
                <DetailRow
                    icon={<Building2 className="size-4" />}
                    label="Home branch"
                    value={branchName ?? null}
                />
                <DetailRow
                    icon={<Calendar className="size-4" />}
                    label="Joined on"
                    value={data.joined_at || null}
                />
                <DetailRow
                    icon={<MapPin className="size-4" />}
                    label="Address"
                    value={data.address || null}
                />
                <DetailRow
                    icon={<ShieldAlert className="size-4" />}
                    label="Emergency contact"
                    value={emergencyContact || null}
                />
                <DetailRow
                    icon={<StickyNote className="size-4" />}
                    label="Notes"
                    value={data.notes || null}
                />
            </div>
        </PreviewCard>
    );
}
