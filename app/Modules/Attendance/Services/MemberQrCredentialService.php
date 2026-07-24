<?php

namespace App\Modules\Attendance\Services;

use App\Models\Member;
use App\Modules\Attendance\Contracts\MemberQrCardProvider;
use App\Modules\Attendance\DTOs\QrCardData;
use App\Modules\Attendance\Models\MemberQrCredential;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

class MemberQrCredentialService implements MemberQrCardProvider
{
    public function cardForMember(int $memberId, ?int $issuedBy = null): QrCardData
    {
        return DB::transaction(function () use ($memberId, $issuedBy): QrCardData {
            $member = Member::query()->lockForUpdate()->findOrFail($memberId);
            $credential = MemberQrCredential::query()
                ->where('member_id', $member->id)
                ->whereNull('revoked_at')
                ->where(fn ($query) => $query
                    ->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now()))
                ->latest('id')
                ->first();

            return $this->toCard($credential ?: $this->issue($member, $issuedBy));
        });
    }

    public function rotateForMember(int $memberId, ?int $issuedBy = null): QrCardData
    {
        return DB::transaction(function () use ($memberId, $issuedBy): QrCardData {
            $member = Member::query()->lockForUpdate()->findOrFail($memberId);

            MemberQrCredential::query()
                ->where('member_id', $member->id)
                ->whereNull('revoked_at')
                ->update(['revoked_at' => now()]);

            return $this->toCard($this->issue($member, $issuedBy));
        });
    }

    public function revokeForMember(int $memberId): void
    {
        DB::transaction(function () use ($memberId): void {
            $member = Member::query()->lockForUpdate()->findOrFail($memberId);
            MemberQrCredential::query()
                ->where('member_id', $member->id)
                ->whereNull('revoked_at')
                ->update(['revoked_at' => now()]);
        });
    }

    public function resolveToken(string $token, bool $lockForUpdate = false): ?MemberQrCredential
    {
        [$publicId, $signature] = array_pad(explode('.', $token, 2), 2, null);

        if (! is_string($publicId) || ! Str::isUuid($publicId) || ! is_string($signature)) {
            return null;
        }

        if (! hash_equals($this->signature($publicId), $signature)) {
            return null;
        }

        $query = MemberQrCredential::query()
            ->with('member')
            ->where('public_id', $publicId);

        if ($lockForUpdate) {
            $query->lockForUpdate();
        }

        $credential = $query->first();

        if (
            ! $credential
            || $credential->revoked_at
            || ($credential->expires_at && ! $credential->expires_at->isFuture())
            || ! hash_equals((string) $credential->token_hash, hash('sha256', $token))
        ) {
            return null;
        }

        return $credential;
    }

    private function issue(Member $member, ?int $issuedBy): MemberQrCredential
    {
        $publicId = (string) Str::uuid();
        $token = $this->token($publicId);

        return MemberQrCredential::query()->create([
            'tenant_id' => $member->tenant_id,
            'member_id' => $member->id,
            'public_id' => $publicId,
            'token_hash' => hash('sha256', $token),
            'issued_at' => now(),
            'expires_at' => null,
            'issued_by' => $issuedBy,
        ]);
    }

    private function toCard(MemberQrCredential $credential): QrCardData
    {
        return new QrCardData(
            publicId: $credential->public_id,
            token: $this->token($credential->public_id),
            issuedAt: $credential->issued_at->toIso8601String(),
            expiresAt: $credential->expires_at?->toIso8601String(),
        );
    }

    private function token(string $publicId): string
    {
        return $publicId.'.'.$this->signature($publicId);
    }

    private function signature(string $publicId): string
    {
        $key = (string) config('app.key');
        throw_if($key === '', RuntimeException::class, 'Application key is required for QR signing.');

        if (str_starts_with($key, 'base64:')) {
            $decoded = base64_decode(substr($key, 7), true);
            $key = $decoded !== false ? $decoded : $key;
        }

        return hash_hmac('sha256', 'gms-attendance|'.$publicId, $key);
    }
}
