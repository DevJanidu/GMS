<?php

namespace App\Modules\Audit\Services;

final class SensitiveValueRedactor
{
    /** @var list<string> */
    private const SENSITIVE_KEYS = [
        'password', 'password_confirmation', 'password_hash', 'token',
        'access_token', 'refresh_token', 'authorization', 'api_key', 'secret',
        'client_secret', 'card_number', 'pan', 'cvv', 'cvc', 'verification_value',
    ];

    /**
     * @param  array<string, mixed>  $values
     * @return array<string, mixed>
     */
    public function redact(array $values): array
    {
        $redacted = [];

        foreach ($values as $key => $value) {
            $normalized = strtolower(str_replace(['-', ' '], '_', (string) $key));
            $redacted[$key] = $this->isSensitive($normalized)
                ? '[REDACTED]'
                : (is_array($value) ? $this->redact($value) : $value);
        }

        return $redacted;
    }

    private function isSensitive(string $key): bool
    {
        foreach (self::SENSITIVE_KEYS as $sensitive) {
            if ($key === $sensitive || str_ends_with($key, '_'.$sensitive)) {
                return true;
            }
        }

        return false;
    }
}
