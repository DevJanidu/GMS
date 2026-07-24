<?php

namespace App\Modules\MemberPortal\Resources;

use App\Modules\Membership\Models\Membership;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Membership */
class MemberPortalMembershipResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'plan_name' => $this->plan_name_snapshot,
            'starts_on' => $this->starts_on->toDateString(),
            'expires_on' => $this->expires_on->toDateString(),
            'grace_ends_on' => $this->grace_ends_on->toDateString(),
            'expired' => $this->expires_on->isBefore(today()),
            'in_grace_period' => $this->isInGracePeriod(),
            'freeze_started_on' => $this->freeze_started_on?->toDateString(),
            'freeze_resumes_on' => $this->freeze_resumes_on?->toDateString(),
            'branch' => $this->whenLoaded('branch', fn () => $this->branch ? [
                'name' => $this->branch->name,
            ] : null),
        ];
    }
}
