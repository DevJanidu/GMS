import { apiClient } from '@/lib/api/client';
import type { ApiSuccess } from '@/lib/api/client';
import type {
    ApiPage,
    PortalAttendance,
    PortalDashboard,
    PortalMembership,
    PortalNotification,
    PortalPayment,
    PortalProfile,
    PortalQrCard,
    PortalReceipt,
} from '../types';

export type ProfileInput = Pick<
    PortalProfile,
    | 'first_name'
    | 'last_name'
    | 'phone'
    | 'address'
    | 'emergency_contact_name'
    | 'emergency_contact_phone'
>;

export const memberPortalApi = {
    dashboard: () =>
        apiClient.get<ApiSuccess<PortalDashboard>>('/member-portal/dashboard'),
    profile: () =>
        apiClient.get<ApiSuccess<PortalProfile>>('/member-portal/profile'),
    updateProfile: (input: ProfileInput) =>
        apiClient.put<ApiSuccess<PortalProfile>>('/member-portal/profile', input),
    qrCard: () =>
        apiClient.get<ApiSuccess<PortalQrCard>>('/member-portal/qr-card'),
    membership: () =>
        apiClient.get<ApiSuccess<PortalMembership | null>>(
            '/member-portal/membership',
        ),
    payments: (page = 1) =>
        apiClient.get<ApiPage<PortalPayment>>(
            `/member-portal/payments?page=${page}`,
        ),
    receipts: (page = 1) =>
        apiClient.get<ApiPage<PortalReceipt>>(
            `/member-portal/receipts?page=${page}`,
        ),
    receipt: (id: string) =>
        apiClient.get<ApiSuccess<PortalReceipt>>(
            `/member-portal/receipts/${encodeURIComponent(id)}`,
        ),
    attendance: (page = 1) =>
        apiClient.get<ApiPage<PortalAttendance>>(
            `/member-portal/attendance?page=${page}`,
        ),
    notifications: (page = 1) =>
        apiClient.get<ApiPage<PortalNotification>>(
            `/member-portal/notifications?page=${page}`,
        ),
    markNotificationRead: (id: string) =>
        apiClient.patch<ApiSuccess<PortalNotification>>(
            `/member-portal/notifications/${encodeURIComponent(id)}/read`,
        ),
    markNotificationUnread: (id: string) =>
        apiClient.patch<ApiSuccess<PortalNotification>>(
            `/member-portal/notifications/${encodeURIComponent(id)}/unread`,
        ),
    markAllNotificationsRead: () =>
        apiClient.post<ApiSuccess<{ updated: number }>>(
            '/member-portal/notifications/mark-all-read',
        ),
};
