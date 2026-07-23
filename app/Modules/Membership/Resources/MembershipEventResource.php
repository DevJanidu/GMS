<?php

namespace App\Modules\Membership\Resources;

use App\Modules\Membership\Models\MembershipEvent;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin MembershipEvent
 */
class MembershipEventResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type->value,
            'type_label' => $this->type->label(),
            'from_status' => $this->from_status,
            'to_status' => $this->to_status,
            'occurred_at' => $this->occurred_at->toIso8601String(),
            'actor' => $this->whenLoaded('actor', fn () => $this->actor ? [
                'id' => $this->actor->id,
                'name' => $this->actor->name,
            ] : null),
            'metadata' => $this->metadata ?: [],
        ];
    }
}
