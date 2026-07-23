import { apiClient } from '@/lib/api/client';
import type { ApiSuccess } from '@/lib/api/client';
import type { InviteStaffValues, Staff, UpdateStaffValues } from '../types';

export type StaffListParams = {
    search?: string;
    status?: string;
    branch_id?: number;
};

function toQueryString(params: StaffListParams): string {
    const query = new URLSearchParams();

    if (params.search) {
        query.set('search', params.search);
    }

    if (params.status) {
        query.set('status', params.status);
    }

    if (params.branch_id) {
        query.set('branch_id', String(params.branch_id));
    }

    const qs = query.toString();

    return qs ? `?${qs}` : '';
}

export const staffApi = {
    list: (params: StaffListParams = {}) =>
        apiClient.get<ApiSuccess<Staff[]>>(`/staff${toQueryString(params)}`),

    get: (id: number) => apiClient.get<ApiSuccess<Staff>>(`/staff/${id}`),

    invite: (values: Partial<InviteStaffValues>) =>
        apiClient.post<ApiSuccess<Staff>>('/staff', values),

    update: (id: number, values: Partial<UpdateStaffValues>) =>
        apiClient.put<ApiSuccess<Staff>>(`/staff/${id}`, values),

    remove: (id: number) => apiClient.delete<ApiSuccess<null>>(`/staff/${id}`),

    suspend: (id: number) =>
        apiClient.patch<ApiSuccess<Staff>>(`/staff/${id}/suspend`),

    activate: (id: number) =>
        apiClient.patch<ApiSuccess<Staff>>(`/staff/${id}/activate`),

    assignBranches: (
        id: number,
        branchIds: number[],
        primaryBranchId: number | null,
    ) =>
        apiClient.put<ApiSuccess<Staff>>(`/staff/${id}/branches`, {
            branch_ids: branchIds,
            primary_branch_id: primaryBranchId,
        }),
};
