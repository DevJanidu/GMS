<?php

namespace App\Modules\Billing\Services;

use App\Models\User;
use App\Modules\Billing\Models\Invoice;
use Illuminate\Auth\Access\AuthorizationException;

class BillingAuthorizer
{
    public function authorize(User $user, string $permission, ?Invoice $invoice = null, ?int $branchId = null): void
    {
        $targetBranch = $invoice ? $invoice->branch_id : $branchId;

        if (! $user->hasRole('owner') && ! $user->hasPermission($permission)) {
            throw new AuthorizationException("Missing billing permission: {$permission}.");
        }
        if ($invoice && (int) $invoice->tenant_id !== (int) $user->tenant_id) {
            throw new AuthorizationException('The invoice belongs to another tenant.');
        }
        if ($targetBranch && ! $user->hasRole('owner') && ! $user->isAssignedToBranch($targetBranch)) {
            throw new AuthorizationException('The invoice belongs to an unassigned branch.');
        }
    }
}
