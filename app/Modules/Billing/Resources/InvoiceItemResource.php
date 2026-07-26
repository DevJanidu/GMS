<?php

namespace App\Modules\Billing\Resources;

use App\Modules\Billing\Models\InvoiceItem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin InvoiceItem */
class InvoiceItemResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id, 'description' => $this->description, 'item_type' => $this->item_type,
            'quantity' => $this->quantity, 'unit_price_cents' => $this->unit_price_cents,
            'line_total_cents' => $this->line_total_cents, 'metadata' => $this->metadata,
        ];
    }
}
