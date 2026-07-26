<?php

namespace App\Modules\Billing\Resources;

use App\Modules\Billing\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Payment */
class PaymentResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id, 'public_id' => $this->public_id, 'invoice_id' => $this->invoice_id,
            'payment_number' => $this->payment_number, 'amount_cents' => $this->amount_cents,
            'method' => $this->method->value, 'reference' => $this->reference,
            'metadata' => $this->metadata, 'paid_at' => $this->paid_at->toIso8601String(),
            'refunded_cents' => (int) ($this->refunds_sum_amount_cents ?? 0),
            'receipt' => new ReceiptResource($this->whenLoaded('receipt')),
        ];
    }
}
