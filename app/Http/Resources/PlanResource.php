<?php

namespace App\Http\Resources;

use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Plan
 */
class PlanResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => (float) $this->price,
            'joining_fee' => (float) $this->joining_fee,
            'duration_value' => $this->duration_value,
            'duration_unit' => $this->duration_unit->value,
            // Cast to object so an empty rule set encodes as JSON `{}`
            // rather than `[]` — PHP can't otherwise distinguish the two
            // for an empty array, but the frontend expects an object.
            'access_rules' => (object) ($this->access_rules ?: []),
            'available_at_all_branches' => $this->available_at_all_branches,
            'status' => $this->status->value,
            'cloned_from_id' => $this->cloned_from_id,
            'branches' => $this->whenLoaded('branches', fn () => $this->branches->map(fn ($branch) => [
                'id' => $branch->id,
                'name' => $branch->name,
            ])),
            'price_history' => $this->whenLoaded('priceHistory', fn () => $this->priceHistory
                ->map(fn ($entry) => (new PlanPriceHistoryResource($entry))->resolve())
                ->all()),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
