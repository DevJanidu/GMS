<?php

namespace App\Modules\Billing\Services;

use App\Models\Branch;
use App\Models\Member;
use App\Modules\Billing\Enums\DiscountType;
use App\Modules\Billing\Enums\InvoiceStatus;
use App\Modules\Billing\Models\Invoice;
use App\Tenancy\Services\TenantContext;
use DomainException;
use Illuminate\Support\Facades\DB;
use RuntimeException;

/**
 * Internal adapter kept deliberately DTO/array based until the shared
 * InvoiceCreator contract lands. See INTEGRATION_NOTES.md for its binding.
 */
class InvoiceCreatorService
{
    public function __construct(
        private readonly InvoiceCalculator $calculator,
        private readonly BillingSequence $sequence,
        private readonly BillingEventStore $events,
    ) {}

    /**
     * @param array{
     *   branch_id:int, member_id?:int|null, membership_id?:int|null, currency:string,
     *   issued_on?:string, due_on?:string|null, discount_type?:string|null,
     *   discount_value?:int, tax_rate_basis_points?:int, joining_fee_cents?:int,
     *   notes?:string|null, idempotency_key?:string|null, created_by?:int|null,
     *   items:list<array{description:string,item_type?:string,quantity:int,unit_price_cents:int,metadata?:array<string,mixed>|null}>
     * } $data
     */
    public function create(array $data): Invoice
    {
        return DB::transaction(function () use ($data): Invoice {
            $tenantId = app(TenantContext::class)->id();
            throw_if(! $tenantId, RuntimeException::class, 'Tenant context is required.');

            $hashData = $data;
            unset($hashData['idempotency_key'], $hashData['created_by']);
            $idempotencyHash = hash('sha256', json_encode($hashData, JSON_THROW_ON_ERROR));
            // The tenant sequence row is also the creation mutex. Acquiring it
            // before the idempotency lookup serializes identical concurrent
            // requests so only one invoice can be inserted.
            $invoiceNumber = $this->sequence->next('invoice', 'INV');

            if (! empty($data['idempotency_key'])) {
                $existing = Invoice::query()->where('idempotency_key', $data['idempotency_key'])->first();
                if ($existing) {
                    if (! hash_equals((string) $existing->idempotency_hash, $idempotencyHash)) {
                        throw new DomainException('The idempotency key was already used for a different invoice.');
                    }

                    return $existing->load('items');
                }
            }

            Branch::query()->findOrFail($data['branch_id']);
            if (! empty($data['member_id'])) {
                Member::query()->findOrFail($data['member_id']);
            }

            $discountType = isset($data['discount_type'])
                ? DiscountType::from($data['discount_type'])
                : null;
            $totals = $this->calculator->calculate(
                $data['items'],
                $discountType,
                $data['discount_value'] ?? 0,
                $data['tax_rate_basis_points'] ?? 0,
                $data['joining_fee_cents'] ?? 0,
            );

            $invoice = Invoice::query()->create([
                'tenant_id' => $tenantId,
                'branch_id' => $data['branch_id'],
                'member_id' => $data['member_id'] ?? null,
                'membership_id' => $data['membership_id'] ?? null,
                'invoice_number' => $invoiceNumber,
                'status' => InvoiceStatus::Open,
                'currency' => strtoupper($data['currency']),
                'issued_on' => $data['issued_on'] ?? now()->toDateString(),
                'due_on' => $data['due_on'] ?? null,
                'subtotal_cents' => $totals->subtotalCents,
                'discount_type' => $discountType,
                'discount_value' => $data['discount_value'] ?? 0,
                'discount_cents' => $totals->discountCents,
                'tax_rate_basis_points' => $data['tax_rate_basis_points'] ?? 0,
                'tax_cents' => $totals->taxCents,
                'joining_fee_cents' => $totals->joiningFeeCents,
                'grand_total_cents' => $totals->grandTotalCents,
                'balance_due_cents' => $totals->grandTotalCents,
                'notes' => $data['notes'] ?? null,
                'idempotency_key' => $data['idempotency_key'] ?? null,
                'idempotency_hash' => ! empty($data['idempotency_key']) ? $idempotencyHash : null,
                'created_by' => $data['created_by'] ?? null,
            ]);

            foreach ($data['items'] as $item) {
                $invoice->items()->create([
                    'tenant_id' => $tenantId,
                    'description' => $item['description'],
                    'item_type' => $item['item_type'] ?? 'other',
                    'quantity' => $item['quantity'],
                    'unit_price_cents' => $item['unit_price_cents'],
                    'line_total_cents' => $item['quantity'] * $item['unit_price_cents'],
                    'metadata' => $item['metadata'] ?? null,
                ]);
            }

            $this->events->record('InvoiceCreated', $invoice, [
                'invoice_number' => $invoice->invoice_number,
                'grand_total_cents' => $invoice->grand_total_cents,
                'member_id' => $invoice->member_id,
                'membership_id' => $invoice->membership_id,
            ]);

            return $invoice->load('items');
        });
    }
}
