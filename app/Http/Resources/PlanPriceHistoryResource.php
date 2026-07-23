<?php

namespace App\Http\Resources;

use App\Models\PlanPriceHistory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin PlanPriceHistory
 */
class PlanPriceHistoryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'price' => (float) $this->price,
            'joining_fee' => (float) $this->joining_fee,
            'effective_from' => $this->effective_from->toIso8601String(),
            'effective_until' => $this->effective_until?->toIso8601String(),
        ];
    }
}
