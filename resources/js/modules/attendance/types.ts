export type AttendanceReason =
    | 'member_not_found'
    | 'member_inactive'
    | 'membership_not_found'
    | 'membership_not_active'
    | 'membership_expired'
    | 'membership_frozen'
    | 'membership_suspended'
    | 'branch_not_allowed'
    | 'plan_access_denied'
    | 'visit_limit_reached'
    | 'already_checked_in'
    | 'duplicate_request'
    | 'invalid_qr'
    | 'rate_limit_exceeded';

export type SafeMember = {
    id: number;
    member_number: string;
    display_name: string;
    status?: string;
};

export type AttendanceResult = {
    result: 'checked_in' | 'checked_out';
    attendance_record_id: number;
    member: SafeMember;
    checked_in_at?: string;
    checked_out_at?: string;
    replayed: boolean;
    override_applied: boolean;
};

export type AttendanceCorrection = {
    id: number;
    type: string;
    before: Record<string, unknown>;
    after: Record<string, unknown>;
    reason: string;
    corrected_at: string;
    corrected_by: { id: number; name: string } | null;
};

export type AttendanceRecord = {
    id: number;
    branch: { id: number; name: string };
    member: SafeMember;
    membership_id: number | null;
    status: 'checked_in' | 'checked_out' | 'reversed';
    source: 'phone_camera' | 'manual';
    checked_in_at: string;
    checked_out_at: string | null;
    device_id: string | null;
    recorded_by: { id: number; name: string } | null;
    override: {
        actor: { id: number | null; name: string | null };
        reason: string;
    } | null;
    corrections: AttendanceCorrection[];
};

export type AttendanceSettings = {
    id: number;
    branch_id: number;
    mode: 'check_in_only' | 'check_in_out';
    duplicate_window_seconds: number;
    allow_manual_entry: boolean;
    manager_override_required: boolean;
    visit_limit_rules: {
        visits_per_day?: number;
        visits_per_week?: number;
        visits_per_month?: number;
    };
};

export type LiveAttendance = {
    count: number;
    mode: AttendanceSettings['mode'];
    records: AttendanceRecord[];
    truncated: boolean;
    as_of: string;
};

export type RecentScan = {
    id: number;
    attendance_record_id: number | null;
    member: SafeMember | null;
    result: string;
    reason_code: AttendanceReason | null;
    message: string | null;
    source: string;
    device_id: string | null;
    scanned_at: string;
};
