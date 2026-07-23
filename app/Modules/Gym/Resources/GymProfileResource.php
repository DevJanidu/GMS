<?php

namespace App\Modules\Gym\Resources;

use App\Modules\Gym\Models\GymProfile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin GymProfile */
class GymProfileResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'legal_name' => $this->legal_name,
            'logo_path' => $this->logo_path,
            'address' => $this->address,
            'city' => $this->city,
            'country' => $this->country,
            'contact_email' => $this->contact_email,
            'contact_phone' => $this->contact_phone,
            'tax_id' => $this->tax_id,
            'website' => $this->website,
            'description' => $this->description,
            'tenant' => [
                'name' => $this->tenant->name,
                'timezone' => $this->tenant->timezone,
                'currency' => $this->tenant->currency,
            ],
        ];
    }
}
