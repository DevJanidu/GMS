<?php

namespace App\Modules\Billing\Resources;

use App\Modules\Billing\Models\Refund;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Refund */
class RefundResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id, 'public_id' => $this->public_id, 'invoice_id' => $this->invoice_id,
            'payment_id' => $this->payment_id, 'refund_number' => $this->refund_number,
            'amount_cents' => $this->amount_cents, 'reason' => $this->reason,
            'metadata' => $this->metadata, 'refunded_at' => $this->refunded_at->toIso8601String(),
        ];
    }
}
