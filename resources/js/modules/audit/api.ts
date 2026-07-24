import { apiClient } from '@/lib/api/client';
import type { ApiSuccess } from '@/lib/api/client';

export type AuditLog = {
    id: number;
    branch_id: number | null;
    actor_id: number | null;
    actor: { id: number; name: string; email: string } | null;
    action: string;
    entity_type: string;
    entity_id: string;
    changes: Record<string, unknown>;
    before_values: Record<string, unknown>;
    after_values: Record<string, unknown>;
    context: Record<string, unknown>;
    request_id: string | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
};

export type AuditPage = ApiSuccess<AuditLog[]> & {
    meta: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
};

export const auditApi = {
    list: (query = '') => apiClient.get<AuditPage>(`/audit-logs${query}`),
    show: (id: number) =>
        apiClient.get<ApiSuccess<AuditLog>>(`/audit-logs/${id}`),
    export: (input: {
        date_from: string;
        date_to: string;
        branch_id?: number;
    }) =>
        apiClient.post<ApiSuccess<{ id: string; status: string }>>(
            '/audit-logs/exports',
            input,
        ),
};
