<?php

namespace App\Modules\Billing\Resources;

use App\Modules\Billing\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Invoice */
class InvoiceResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'public_id' => $this->public_id,
            'invoice_number' => $this->invoice_number,
            'branch_id' => $this->branch_id,
            'member_id' => $this->member_id,
            'membership_id' => $this->membership_id,
            'member' => $this->whenLoaded('member', fn () => $this->member ? [
                'id' => $this->member->id,
                'member_number' => $this->member->member_number,
                'name' => $this->member->fullName(),
            ] : null),
            'branch' => $this->whenLoaded('branch', fn () => [
                'id' => $this->branch->id,
                'name' => $this->branch->name,
            ]),
            'status' => $this->status->value,
            'currency' => $this->currency,
            'issued_on' => $this->issued_on->toDateString(),
            'due_on' => $this->due_on?->toDateString(),
            'subtotal_cents' => $this->subtotal_cents,
            'discount_type' => $this->discount_type?->value,
            'discount_value' => $this->discount_value,
            'discount_cents' => $this->discount_cents,
            'tax_rate_basis_points' => $this->tax_rate_basis_points,
            'tax_cents' => $this->tax_cents,
            'joining_fee_cents' => $this->joining_fee_cents,
            'grand_total_cents' => $this->grand_total_cents,
            'amount_paid_cents' => $this->amount_paid_cents,
            'amount_refunded_cents' => $this->amount_refunded_cents,
            'balance_due_cents' => $this->balance_due_cents,
            'notes' => $this->notes,
            'voided_at' => $this->voided_at?->toIso8601String(),
            'void_reason' => $this->void_reason,
            'items' => InvoiceItemResource::collection($this->whenLoaded('items')),
            'payments' => PaymentResource::collection($this->whenLoaded('payments')),
            'refunds' => RefundResource::collection($this->whenLoaded('refunds')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
