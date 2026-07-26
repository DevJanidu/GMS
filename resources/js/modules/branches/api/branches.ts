import { apiClient } from '@/lib/api/client';
import type { ApiSuccess } from '@/lib/api/client';
import type { Branch, BranchFormValues, OpeningHours } from '../types';

export type BranchListParams = {
    search?: string;
    status?: string;
    page?: number;
};

function toQueryString(params: BranchListParams): string {
    const query = new URLSearchParams();

    if (params.search) {
        query.set('search', params.search);
    }

    if (params.status) {
        query.set('status', params.status);
    }

    if (params.page) {
        query.set('page', String(params.page));
    }

    const qs = query.toString();

    return qs ? `?${qs}` : '';
}

export const branchesApi = {
    list: (params: BranchListParams = {}) =>
        apiClient.get<ApiSuccess<Branch[]>>(
            `/branches${toQueryString(params)}`,
        ),

    get: (id: number) => apiClient.get<ApiSuccess<Branch>>(`/branches/${id}`),

    create: (values: Partial<BranchFormValues>) =>
        apiClient.post<ApiSuccess<Branch>>('/branches', values),

    update: (id: number, values: Partial<BranchFormValues>) =>
        apiClient.put<ApiSuccess<Branch>>(`/branches/${id}`, values),

    remove: (id: number) =>
        apiClient.delete<ApiSuccess<null>>(`/branches/${id}`),

    updateOpeningHours: (id: number, openingHours: OpeningHours) =>
        apiClient.put<ApiSuccess<Branch>>(`/branches/${id}/opening-hours`, {
            opening_hours: openingHours,
        }),
};
