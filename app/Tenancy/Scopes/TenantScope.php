<?php

namespace App\Tenancy\Scopes;

use App\Tenancy\Services\TenantContext;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * Restricts all queries for a tenant-owned model to the tenant resolved
 * for the current request. No-op when no tenant context is bound
 * (e.g. console commands, tests that opt out).
 *
 * @implements Scope<Model>
 */
class TenantScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $tenant = app(TenantContext::class)->get();

        if ($tenant) {
            $builder->where($model->qualifyColumn('tenant_id'), $tenant->id);
        }
    }
}
