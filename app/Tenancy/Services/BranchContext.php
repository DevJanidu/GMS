<?php

namespace App\Tenancy\Services;

use App\Models\Branch;

/**
 * Holds the branch resolved for the current request (the "acting branch"
 * a staff member is currently operating in), bound as a singleton.
 */
class BranchContext
{
    protected ?Branch $branch = null;

    public function set(?Branch $branch): void
    {
        $this->branch = $branch;
    }

    public function get(): ?Branch
    {
        return $this->branch;
    }

    public function id(): ?int
    {
        return $this->branch?->id;
    }

    public function check(): bool
    {
        return $this->branch !== null;
    }
}
