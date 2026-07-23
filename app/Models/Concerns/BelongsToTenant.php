<?php

namespace App\Models\Concerns;

use App\Models\Tenant;
use App\Tenancy\Scopes\TenantScope;
use App\Tenancy\Services\TenantContext;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Auto-scopes the model to the current tenant and stamps new records
 * with the tenant resolved from the request's tenant context.
 */
trait BelongsToTenant
{
    protected static function bootBelongsToTenant(): void
    {
        static::addGlobalScope(new TenantScope);

        static::creating(function (Model $model) {
            if ($model->getAttribute('tenant_id')) {
                return;
            }

            $tenant = app(TenantContext::class)->get();

            if ($tenant) {
                $model->setAttribute('tenant_id', $tenant->id);
            }
        });
    }

    /**
     * @return BelongsTo<Tenant, $this>
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
