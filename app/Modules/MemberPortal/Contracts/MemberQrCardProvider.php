<?php

namespace App\Modules\MemberPortal\Contracts;

use App\Models\Member;
use App\Modules\MemberPortal\DTOs\MemberQrCard;

/**
 * Attendance owns credential issuance, signing, rotation and validation.
 * The portal only renders the safe payload supplied through this contract.
 */
interface MemberQrCardProvider
{
    public function forMember(Member $member): MemberQrCard;
}
