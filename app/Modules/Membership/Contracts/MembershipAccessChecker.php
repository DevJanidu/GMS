<?php

namespace App\Modules\Membership\Contracts;

use App\Modules\Membership\Models\Membership;
use Carbon\CarbonImmutable;

/**
 * Named in both the Phase 2 and Phase 3 shared-contracts lists in SRS
 * B.5/B.6 — Phase 3's Attendance module will depend on this to decide
 * whether a scanned member currently has access. Implemented here since
 * Membership owns status/grace logic; promote the interface (not the
 * implementation) to App\Shared\Contracts when Attendance's worktree
 * starts, per INTEGRATION_NOTES.md.
 */
interface MembershipAccessChecker
{
    public function hasAccess(Membership $membership, ?CarbonImmutable $at = null): bool;

    public function isInGracePeriod(Membership $membership, ?CarbonImmutable $at = null): bool;
}
