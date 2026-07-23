export type OpeningHoursDay = {
    open?: string;
    close?: string;
    closed?: boolean;
};

export type OpeningHours = Record<string, OpeningHoursDay>;

export type Branch = {
    id: number;
    name: string;
    code: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    status: 'active' | 'inactive';
    opening_hours: OpeningHours | null;
    staff_count?: number;
    created_at: string;
    updated_at: string;
};

export type BranchFormValues = {
    name: string;
    code: string;
    address: string;
    phone: string;
    email: string;
    status: 'active' | 'inactive';
};

export const DAYS_OF_WEEK = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
] as const;
