<?php

namespace App\Modules\MemberPortal\Resources;

use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Member */
class MemberPortalProfileResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'member_number' => $this->member_number,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->fullName(),
            'email' => $this->email,
            'phone' => $this->phone,
            'date_of_birth' => $this->date_of_birth?->toDateString(),
            'address' => $this->address,
            'emergency_contact_name' => $this->emergency_contact_name,
            'emergency_contact_phone' => $this->emergency_contact_phone,
            'photo_url' => $this->photoUrl(),
            'status' => $this->status->value,
            'joined_at' => $this->joined_at->toDateString(),
            'branch' => $this->whenLoaded('branch', fn () => $this->branch ? [
                'name' => $this->branch->name,
            ] : null),
        ];
    }
}
