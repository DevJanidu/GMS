<?php

namespace App\Modules\MemberPortal\Services;

use App\Models\Member;
use App\Modules\Attendance\Contracts\MemberQrCardProvider as AttendanceQrCardProvider;
use App\Modules\MemberPortal\Contracts\MemberQrCardProvider;
use App\Modules\MemberPortal\DTOs\MemberQrCard;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Throwable;

/**
 * Bridges Attendance's real QR credential issuance (App\Modules\Attendance)
 * to the safe presentation contract the member portal renders. Attendance
 * owns the signed token; this class only turns it into a displayable image.
 */
class AttendanceMemberQrCardProvider implements MemberQrCardProvider
{
    public function __construct(private AttendanceQrCardProvider $credentials) {}

    public function forMember(Member $member): MemberQrCard
    {
        try {
            $card = $this->credentials->cardForMember($member->id);
        } catch (Throwable) {
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

        return new MemberQrCard(
            status: 'ready',
            qrPayload: $card->token,
            qrImageDataUrl: $this->renderSvgDataUrl($card->token),
            credentialId: $card->publicId,
            issuedAt: $card->issuedAt,
            expiresAt: $card->expiresAt,
            message: 'Show this code to front-desk staff, or let them scan it, to check in.',
        );
    }

    private function renderSvgDataUrl(string $token): string
    {
        $renderer = new ImageRenderer(new RendererStyle(320), new SvgImageBackEnd);
        $svg = (new Writer($renderer))->writeString($token);

        return 'data:image/svg+xml;base64,'.base64_encode($svg);
    }
}
