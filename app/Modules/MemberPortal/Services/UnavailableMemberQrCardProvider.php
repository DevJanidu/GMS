<?php

namespace App\Modules\MemberPortal\Services;

use App\Models\Member;
use App\Modules\MemberPortal\Contracts\MemberQrCardProvider;
use App\Modules\MemberPortal\DTOs\MemberQrCard;

class UnavailableMemberQrCardProvider implements MemberQrCardProvider
{
    public function forMember(Member $member): MemberQrCard
    {
        return new MemberQrCard(
            status: 'unavailable',
            qrPayload: null,
            qrImageDataUrl: null,
            credentialId: null,
            issuedAt: null,
            expiresAt: null,
            message: 'Your secure QR card is not available yet. Please contact the gym if you need assistance.',
        );
    }
}
