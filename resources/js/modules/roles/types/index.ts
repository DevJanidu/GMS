export type Permission = {
    id: number;
    name: string;
    slug: string;
    group: string | null;
    description: string | null;
};

export type Role = {
    id: number;
    name: string;
    slug: string;
    is_system: boolean;
    is_custom: boolean;
    users_count?: number;
    permissions: Permission[];
    created_at: string;
    updated_at: string;
};

export type RoleFormValues = {
    name: string;
    permissions: number[];
};
