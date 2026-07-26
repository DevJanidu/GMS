<?php

namespace App\Modules\Membership\Resources;

use App\Modules\Membership\Models\Membership;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Membership
 */
class MembershipResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'plan_id' => $this->plan_id,
            'plan_name' => $this->plan_name_snapshot,
            'plan_price' => (float) $this->plan_price_snapshot,
            'plan_joining_fee' => (float) $this->plan_joining_fee_snapshot,
            'plan_duration_value' => $this->plan_duration_value_snapshot,
            'plan_duration_unit' => $this->plan_duration_unit_snapshot,
            'starts_on' => $this->starts_on->toDateString(),
            'expires_on' => $this->expires_on->toDateString(),
            'grace_days' => $this->grace_days,
            'grace_ends_on' => $this->grace_ends_on->toDateString(),
            'in_grace_period' => $this->isInGracePeriod(),
            'has_forward_renewal' => $this->hasForwardRenewal(),
            'previous_membership_id' => $this->previous_membership_id,
            'invoice_id' => $this->invoice_id,
            'freeze_started_on' => $this->freeze_started_on?->toDateString(),
            'freeze_resumes_on' => $this->freeze_resumes_on?->toDateString(),
            'suspended_at' => $this->suspended_at?->toIso8601String(),
            'suspension_reason' => $this->suspension_reason,
            'cancelled_at' => $this->cancelled_at?->toIso8601String(),
            'cancellation_reason' => $this->cancellation_reason,
            'expired_at' => $this->expired_at?->toIso8601String(),
            'notes' => $this->notes,
            'member' => $this->whenLoaded('member', fn () => [
                'id' => $this->member->id,
                'member_number' => $this->member->member_number,
                'full_name' => $this->member->fullName(),
                'email' => $this->member->email,
                'phone' => $this->member->phone,
            ]),
            'branch' => $this->whenLoaded('branch', fn () => [
                'id' => $this->branch->id,
                'name' => $this->branch->name,
            ]),
            'plan' => $this->whenLoaded('plan', fn () => $this->plan ? [
                'id' => $this->plan->id,
                'name' => $this->plan->name,
                'status' => $this->plan->status->value,
            ] : null),
            'previous_membership' => $this->whenLoaded('previousMembership', fn () => $this->previousMembership ? [
                'id' => $this->previousMembership->id,
                'expires_on' => $this->previousMembership->expires_on->toDateString(),
            ] : null),
            'renewal' => $this->whenLoaded('renewal', fn () => $this->renewal ? [
                'id' => $this->renewal->id,
                'starts_on' => $this->renewal->starts_on->toDateString(),
            ] : null),
            // Deliberately not MembershipEventResource::collection(...) — a
            // ResourceCollection nested inside another resource's toArray()
            // serializes as {"data": [...]} once it reaches Inertia's
            // response (Inertia never triggers Laravel's top-level-resource
            // unwrap tracking for values nested inside another resource),
            // but the frontend expects a plain array and calls .map() on it
            // directly.
            'events' => $this->whenLoaded('events', fn () => $this->events
                ->map(fn ($event) => (new MembershipEventResource($event))->resolve())
                ->values()
                ->all()),
            'sold_at' => $this->sold_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
