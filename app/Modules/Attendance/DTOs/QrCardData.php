<?php

namespace App\Modules\Attendance\DTOs;

final readonly class QrCardData
{
    public function __construct(
        public string $publicId,
        public string $token,
        public string $issuedAt,
        public ?string $expiresAt,
    ) {}

    /** @return array{public_id:string,qr_token:string,issued_at:string,expires_at:?string} */
    public function toArray(): array
    {
        return [
            'public_id' => $this->publicId,
            'qr_token' => $this->token,
            'issued_at' => $this->issuedAt,
            'expires_at' => $this->expiresAt,
        ];
    }
}
