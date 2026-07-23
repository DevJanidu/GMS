<?php

namespace App\Modules\Membership\DTOs;

/**
 * Everything Billing needs to build an invoice for a membership sale or
 * renewal, without Membership ever touching the invoices table itself.
 *
 * This mirrors the `InvoiceCreator` contract named in SRS B.5. It is kept
 * module-local (not in App\Shared\Contracts) because no shared contract
 * exists in this baseline yet — see INTEGRATION_NOTES.md for the exact
 * binding Billing's worktree needs to pick up during the Phase 2 merge.
 */
final readonly class MembershipInvoiceData
{
    public function __construct(
        public int $tenantId,
        public int $branchId,
        public int $memberId,
        public int $membershipId,
        public string $planName,
        public float $price,
        public float $joiningFee,
        public bool $isRenewal,
        public ?int $soldBy,
        public ?float $initialPayment = null,
    ) {}
}
