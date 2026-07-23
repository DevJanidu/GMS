import { apiClient } from '@/lib/api/client';
import type { ApiSuccess } from '@/lib/api/client';
import type { Permission, Role, RoleFormValues } from '../types';

export const rolesApi = {
    list: () => apiClient.get<ApiSuccess<Role[]>>('/roles'),

    get: (id: number) => apiClient.get<ApiSuccess<Role>>(`/roles/${id}`),

    create: (values: Partial<RoleFormValues>) =>
        apiClient.post<ApiSuccess<Role>>('/roles', values),

    update: (id: number, values: Partial<RoleFormValues>) =>
        apiClient.put<ApiSuccess<Role>>(`/roles/${id}`, values),

    remove: (id: number) => apiClient.delete<ApiSuccess<null>>(`/roles/${id}`),
};

export const permissionsApi = {
    list: () => apiClient.get<ApiSuccess<Permission[]>>('/permissions'),
};
