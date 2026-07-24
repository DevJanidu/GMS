<?php

namespace App\Modules\MemberPortal\Resources;

use App\Modules\Billing\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Payment */
class MemberPortalPaymentResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->public_id,
            'payment_number' => $this->payment_number,
            'amount_cents' => $this->amount_cents,
            'refunded_cents' => (int) ($this->refunds_sum_amount_cents ?? 0),
            'currency' => $this->whenLoaded('invoice', fn () => $this->invoice->currency),
            'method' => $this->method->value,
            'paid_at' => $this->paid_at->toIso8601String(),
            'receipt' => $this->whenLoaded('receipt', fn () => $this->receipt ? [
                'id' => $this->receipt->public_id,
                'receipt_number' => $this->receipt->receipt_number,
            ] : null),
        ];
    }
}
