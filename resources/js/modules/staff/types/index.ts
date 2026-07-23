import type { Role } from '@/modules/roles/types';

export type StaffBranch = {
    id: number;
    name: string;
    code: string;
    is_primary: boolean;
};

export type Staff = {
    id: number;
    name: string;
    email: string;
    status: 'invited' | 'active' | 'suspended';
    job_title: string | null;
    phone: string | null;
    invited_at: string | null;
    activated_at: string | null;
    roles: Role[];
    branches: StaffBranch[];
    created_at: string;
    updated_at: string;
};

export type InviteStaffValues = {
    name: string;
    email: string;
    job_title: string;
    phone: string;
    role_id: number | null;
    branch_ids: number[];
    primary_branch_id: number | null;
};

export type UpdateStaffValues = {
    name: string;
    job_title: string;
    phone: string;
    role_id: number | null;
};
