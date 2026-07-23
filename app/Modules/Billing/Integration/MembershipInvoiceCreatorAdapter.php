<?php

namespace App\Modules\Billing\Integration;

use App\Models\Tenant;
use App\Modules\Billing\Services\InvoiceCreatorService;
use App\Modules\Membership\Contracts\InvoiceCreator;
use App\Modules\Membership\DTOs\InvoiceResult;
use App\Modules\Membership\DTOs\MembershipInvoiceData;
use App\Tenancy\Services\TenantContext;
use DomainException;

final readonly class MembershipInvoiceCreatorAdapter implements InvoiceCreator
{
    public function __construct(
        private InvoiceCreatorService $invoices,
        private TenantContext $tenantContext,
    ) {}

    public function createForMembership(MembershipInvoiceData $data): InvoiceResult
    {
        if ($this->tenantContext->id() !== $data->tenantId) {
            throw new DomainException('The membership does not belong to the active tenant.');
        }

        $tenant = Tenant::query()->findOrFail($data->tenantId);
        $priceCents = self::toCents($data->price);
        $joiningFeeCents = self::toCents($data->joiningFee);

        $invoice = $this->invoices->create([
            'branch_id' => $data->branchId,
            'member_id' => $data->memberId,
            'membership_id' => $data->membershipId,
            'currency' => $tenant->currency,
            'joining_fee_cents' => $joiningFeeCents,
            'created_by' => $data->soldBy,
            'idempotency_key' => sprintf(
                'membership:%d:%s:invoice',
                $data->membershipId,
                $data->isRenewal ? 'renewal' : 'sale',
            ),
            'items' => [[
                'description' => $data->isRenewal
                    ? "Membership renewal — {$data->planName}"
                    : "Membership — {$data->planName}",
                'item_type' => $data->isRenewal ? 'membership_renewal' : 'membership_sale',
                'quantity' => 1,
                'unit_price_cents' => $priceCents,
                'metadata' => [
                    'membership_id' => $data->membershipId,
                    'plan_name' => $data->planName,
                ],
            ]],
        ])->refresh();

        return new InvoiceResult(
            invoiceId: $invoice->id,
            totalAmount: self::toMajorUnits($invoice->grand_total_cents),
            amountPaid: self::toMajorUnits($invoice->amount_paid_cents),
            balance: self::toMajorUnits($invoice->balance_due_cents),
        );
    }

    private static function toCents(float $amount): int
    {
        return (int) round($amount * 100, 0, PHP_ROUND_HALF_UP);
    }

    private static function toMajorUnits(int $amount): float
    {
        return $amount / 100;
    }
}
