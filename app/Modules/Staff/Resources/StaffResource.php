<?php

namespace App\Modules\Staff\Resources;

use App\Models\Branch;
use App\Models\User;
use App\Modules\AccessControl\Resources\RoleResource;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
class StaffResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $profile = $this->relationLoaded('staffProfile') ? $this->staffProfile : null;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'status' => $this->status,
            'job_title' => $profile?->job_title,
            'phone' => $profile?->phone,
            'invited_at' => $profile?->invited_at,
            'activated_at' => $profile?->activated_at,
            // Not RoleResource::collection(...) — nested inside another
            // resource's toArray(), it serializes as {"data": [...]} once it
            // reaches Inertia's response, but the frontend expects a plain
            // array.
            'roles' => $this->whenLoaded('roles', fn () => $this->roles
                ->map(fn ($role) => (new RoleResource($role))->resolve())
                ->values()
                ->all()),
            'branches' => $this->whenLoaded('branches', fn () => $this->branches->map(function (Branch $branch) {
                /** @var Pivot $pivot */
                $pivot = $branch->getRelation('pivot');

                return [
                    'id' => $branch->id,
                    'name' => $branch->name,
                    'code' => $branch->code,
                    'is_primary' => (bool) $pivot->getAttribute('is_primary'),
                ];
            })),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
