<?php

namespace App\Modules\AccessControl\Services;

use App\Models\User;
use App\Modules\AccessControl\Models\AuditLog;
use App\Modules\Audit\Services\SensitiveValueRedactor;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

/**
 * Records who did what to which record, for role/permission and staff
 * lifecycle changes that need an audit trail.
 */
class AuditLogger
{
    public function __construct(private readonly SensitiveValueRedactor $redactor) {}

    /**
     * @param  array<string, mixed>  $changes
     * @param  array<string, mixed>  $before
     * @param  array<string, mixed>  $after
     * @param  array<string, mixed>  $context
     */
    public function log(
        User $actor,
        string $action,
        Model $auditable,
        array $changes = [],
        array $before = [],
        array $after = [],
        array $context = [],
        ?int $branchId = null,
    ): AuditLog {
        $request = app()->bound('request') ? app(Request::class) : null;
        $key = $auditable->getKey();

        return AuditLog::create([
            'tenant_id' => $actor->tenant_id,
            'branch_id' => $branchId,
            'actor_id' => $actor->id,
            'request_id' => $this->requestId($request),
            'ip_address' => $request?->ip(),
            'user_agent' => mb_substr((string) $request?->userAgent(), 0, 1000) ?: null,
            'action' => $action,
            'auditable_type' => $auditable->getMorphClass(),
            'auditable_id' => is_numeric($key) ? (int) $key : 0,
            'entity_identifier' => (string) $key,
            'changes' => $this->redactor->redact($changes),
            'before_values' => $this->redactor->redact($before),
            'after_values' => $this->redactor->redact($after),
            'context' => $this->redactor->redact($context),
        ]);
    }

    private function requestId(?Request $request): ?string
    {
        $value = $request?->header('X-Request-Id');

        return is_string($value) && preg_match('/^[0-9a-f-]{36}$/i', $value) === 1
            ? $value
            : null;
    }
}
