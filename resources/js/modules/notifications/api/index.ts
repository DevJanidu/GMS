import { apiClient } from '@/lib/api/client';
import type { ApiSuccess } from '@/lib/api/client';

export type NotificationTemplate = {
    id: number;
    branch_id: number | null;
    name: string;
    key: string;
    channel: 'in_app' | 'email' | 'sms' | 'whatsapp';
    locale: string;
    subject: string | null;
    body: string;
    variables: string[];
    status: 'active' | 'inactive';
};

export type NotificationRule = {
    id: number;
    name: string;
    event_type: string;
    channel: string;
    status: string;
    offset_minutes: number;
    template?: NotificationTemplate;
};

export type NotificationDelivery = {
    id: number;
    channel: string;
    recipient: string;
    status: string;
    attempt_count: number;
    failure_reason: string | null;
    created_at?: string;
};

export type Announcement = {
    id: number;
    title: string;
    message: string;
    channels: string[];
    status: string;
    scheduled_at: string | null;
};

export type Page<T> = ApiSuccess<T[]> & {
    meta: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
};

export const notificationAdminApi = {
    templates: () =>
        apiClient.get<Page<NotificationTemplate>>(
            '/notification-templates?per_page=100',
        ),
    template: (id: number) =>
        apiClient.get<ApiSuccess<NotificationTemplate>>(
            `/notification-templates/${id}`,
        ),
    createTemplate: (input: Omit<NotificationTemplate, 'id' | 'branch_id'>) =>
        apiClient.post<ApiSuccess<NotificationTemplate>>(
            '/notification-templates',
            input,
        ),
    updateTemplate: (
        id: number,
        input: Omit<NotificationTemplate, 'id' | 'branch_id'>,
    ) =>
        apiClient.put<ApiSuccess<NotificationTemplate>>(
            `/notification-templates/${id}`,
            input,
        ),
    rules: () =>
        apiClient.get<Page<NotificationRule>>(
            '/notification-rules?per_page=100',
        ),
    deliveries: (query = '') =>
        apiClient.get<Page<NotificationDelivery>>(
            `/notification-deliveries${query}`,
        ),
    retryDelivery: (id: number) =>
        apiClient.post<ApiSuccess<NotificationDelivery>>(
            `/notification-deliveries/${id}/retry`,
        ),
    announcements: () =>
        apiClient.get<Page<Announcement>>('/announcements?per_page=100'),
    createAnnouncement: (input: Record<string, unknown>) =>
        apiClient.post<ApiSuccess<Announcement>>('/announcements', input),
    scheduleAnnouncement: (id: number, scheduled_at?: string) =>
        apiClient.post<ApiSuccess<Announcement>>(
            `/announcements/${id}/schedule`,
            { scheduled_at },
        ),
    cancelAnnouncement: (id: number) =>
        apiClient.post<ApiSuccess<Announcement>>(`/announcements/${id}/cancel`),
};
