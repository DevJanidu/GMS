<?php

namespace App\Modules\Attendance\Enums;

enum AttendanceRejectionReason: string
{
    case MemberNotFound = 'member_not_found';
    case MemberInactive = 'member_inactive';
    case MembershipNotFound = 'membership_not_found';
    case MembershipNotActive = 'membership_not_active';
    case MembershipExpired = 'membership_expired';
    case MembershipFrozen = 'membership_frozen';
    case MembershipSuspended = 'membership_suspended';
    case BranchNotAllowed = 'branch_not_allowed';
    case PlanAccessDenied = 'plan_access_denied';
    case VisitLimitReached = 'visit_limit_reached';
    case AlreadyCheckedIn = 'already_checked_in';
    case DuplicateRequest = 'duplicate_request';
    case InvalidQr = 'invalid_qr';
    case RateLimitExceeded = 'rate_limit_exceeded';

    public function message(): string
    {
        return match ($this) {
            self::MemberNotFound => 'Member was not found.',
            self::MemberInactive => 'Member account is not active.',
            self::MembershipNotFound => 'No membership was found.',
            self::MembershipNotActive => 'Membership is not active.',
            self::MembershipExpired => 'Membership has expired.',
            self::MembershipFrozen => 'Membership is frozen.',
            self::MembershipSuspended => 'Membership is suspended.',
            self::BranchNotAllowed => 'This membership cannot be used at this branch.',
            self::PlanAccessDenied => 'The membership plan does not include gym access.',
            self::VisitLimitReached => 'The membership visit limit has been reached.',
            self::AlreadyCheckedIn => 'The member is already checked in.',
            self::DuplicateRequest => 'This attendance request was already processed.',
            self::InvalidQr => 'The QR code is invalid or no longer active.',
            self::RateLimitExceeded => 'Too many scan attempts. Please wait and try again.',
        };
    }
}
