<?php

namespace App\Modules\Attendance\Contracts;

use App\Modules\Attendance\DTOs\QrCardData;

/**
 * Safe presentation boundary for Worktree 1's member portal. The caller must
 * resolve and authorize the member; this provider repeats tenant scoping.
 */
interface MemberQrCardProvider
{
    public function cardForMember(int $memberId, ?int $issuedBy = null): QrCardData;

    public function rotateForMember(int $memberId, ?int $issuedBy = null): QrCardData;

    public function revokeForMember(int $memberId): void;
}
