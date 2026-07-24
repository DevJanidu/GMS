import { apiClient } from '@/lib/api/client';
import type { ApiSuccess } from '@/lib/api/client';
import type {
    AttendanceRecord,
    AttendanceResult,
    AttendanceSettings,
    LiveAttendance,
    RecentScan,
    SafeMember,
} from '../types';

export type Page<T> = ApiSuccess<T[]> & {
    meta: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
};

const branchQuery = (branchId?: number | null) =>
    branchId ? `?branch_id=${branchId}` : '';

export const attendanceApi = {
    scan: (
        input: {
            qr_token: string;
            request_id: string;
            source: 'phone_camera';
            device_id?: string;
            action?: 'auto' | 'check_in' | 'check_out';
            override?: boolean;
            override_reason?: string;
        },
        branchId?: number | null,
    ) =>
        apiClient.post<ApiSuccess<AttendanceResult>>(
            `/attendance/scans${branchQuery(branchId)}`,
            input,
        ),
    manual: (
        input: {
            member_id: number;
            request_id: string;
            device_id?: string;
            override?: boolean;
            override_reason?: string;
        },
        branchId?: number | null,
    ) =>
        apiClient.post<ApiSuccess<AttendanceResult>>(
            `/attendance/manual${branchQuery(branchId)}`,
            input,
        ),
    searchMembers: (search: string) =>
        apiClient.get<ApiSuccess<SafeMember[]>>(
            `/attendance/members/search?search=${encodeURIComponent(search)}`,
        ),
    live: () => apiClient.get<ApiSuccess<LiveAttendance>>('/attendance/live'),
    records: (query = '') =>
        apiClient.get<Page<AttendanceRecord>>(
            `/attendance/records${query ? `?${query}` : ''}`,
        ),
    record: (id: number) =>
        apiClient.get<ApiSuccess<AttendanceRecord>>(
            `/attendance/records/${id}`,
        ),
    recent: (deviceId?: string) =>
        apiClient.get<ApiSuccess<RecentScan[]>>(
            `/attendance/scans/recent${deviceId ? `?device_id=${encodeURIComponent(deviceId)}` : ''}`,
        ),
    checkout: (id: number, requestId: string, reason: string) =>
        apiClient.post<ApiSuccess<AttendanceRecord>>(
            `/attendance/records/${id}/checkout`,
            { request_id: requestId, reason },
        ),
    correct: (
        id: number,
        input: {
            request_id: string;
            reason: string;
            checked_in_at?: string | null;
            checked_out_at?: string | null;
        },
    ) =>
        apiClient.post<ApiSuccess<AttendanceRecord>>(
            `/attendance/records/${id}/corrections`,
            input,
        ),
    reverse: (id: number, requestId: string, reason: string) =>
        apiClient.post<ApiSuccess<AttendanceRecord>>(
            `/attendance/records/${id}/reversal`,
            { request_id: requestId, reason },
        ),
    settings: () =>
        apiClient.get<ApiSuccess<AttendanceSettings>>('/attendance/settings'),
    updateSettings: (input: Omit<AttendanceSettings, 'id' | 'branch_id'>) =>
        apiClient.put<ApiSuccess<AttendanceSettings>>(
            '/attendance/settings',
            input,
        ),
};
