<?php

namespace App\Modules\AccessControl\Services;

use App\Models\User;
use App\Modules\AccessControl\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;

/**
 * Records who did what to which record, for role/permission and staff
 * lifecycle changes that need an audit trail.
 */
class AuditLogger
{
    /**
     * @param  array<string, mixed>  $changes
     */
    public function log(User $actor, string $action, Model $auditable, array $changes = []): AuditLog
    {
        return AuditLog::create([
            'tenant_id' => $actor->tenant_id,
            'actor_id' => $actor->id,
            'action' => $action,
            'auditable_type' => $auditable->getMorphClass(),
            'auditable_id' => $auditable->getKey(),
            'changes' => $changes,
        ]);
    }
}
