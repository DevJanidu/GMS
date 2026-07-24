<?php

namespace App\Modules\MemberPortal\DTOs;

final readonly class MemberQrCard
{
    public function __construct(
        public string $status,
        public ?string $qrPayload,
        public ?string $qrImageDataUrl,
        public ?string $credentialId,
        public ?string $issuedAt,
        public ?string $expiresAt,
        public string $message,
    ) {}

    /** @return array<string, string|null> */
    public function toArray(): array
    {
        return [
            'status' => $this->status,
            'qr_payload' => $this->qrPayload,
            'qr_image_data_url' => $this->qrImageDataUrl,
            'credential_id' => $this->credentialId,
            'issued_at' => $this->issuedAt,
            'expires_at' => $this->expiresAt,
            'message' => $this->message,
        ];
    }
}
