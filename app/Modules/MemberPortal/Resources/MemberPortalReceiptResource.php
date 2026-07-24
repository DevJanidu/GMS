<?php

namespace App\Modules\MemberPortal\Resources;

use App\Modules\Billing\Models\Receipt;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Receipt */
class MemberPortalReceiptResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $snapshot = $this->snapshot;

        return [
            'id' => $this->public_id,
            'receipt_number' => $this->receipt_number,
            'generated_at' => $this->generated_at->toIso8601String(),
            'currency' => $snapshot['currency'] ?? null,
            'amount_cents' => $snapshot['amount_cents'] ?? null,
            'method' => $snapshot['method'] ?? null,
            'paid_at' => $snapshot['paid_at'] ?? null,
            'items' => collect($snapshot['items'] ?? [])->map(fn (array $item) => [
                'description' => $item['description'] ?? '',
                'quantity' => $item['quantity'] ?? 0,
                'unit_price_cents' => $item['unit_price_cents'] ?? 0,
                'line_total_cents' => $item['line_total_cents'] ?? 0,
            ])->values()->all(),
        ];
    }
}
