<?php

namespace App\Tenancy\Services;

use App\Models\Tenant;

/**
 * Holds the tenant resolved for the current request. Bound as a singleton
 * so both the tenant scope and application code can share one source of truth.
 */
class TenantContext
{
    protected ?Tenant $tenant = null;

    public function set(?Tenant $tenant): void
    {
        $this->tenant = $tenant;
    }

    public function get(): ?Tenant
    {
        return $this->tenant;
    }

    public function id(): ?int
    {
        return $this->tenant?->id;
    }

    public function check(): bool
    {
        return $this->tenant !== null;
    }
}
