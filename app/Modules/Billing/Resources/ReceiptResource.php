<?php

namespace App\Modules\Billing\Resources;

use App\Modules\Billing\Models\Receipt;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Receipt */
class ReceiptResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id, 'public_id' => $this->public_id, 'receipt_number' => $this->receipt_number,
            'invoice_id' => $this->invoice_id, 'payment_id' => $this->payment_id,
            'snapshot' => $this->snapshot, 'generated_at' => $this->generated_at->toIso8601String(),
        ];
    }
}
