<?php

namespace App\Modules\AccessControl\Resources;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Role */
class RoleResource extends JsonResource
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
            'is_system' => $this->is_system,
            'is_custom' => $this->tenant_id !== null,
            'users_count' => $this->whenCounted('users'),
            // Not PermissionResource::collection(...) — nested inside
            // another resource's toArray(), it serializes as
            // {"data": [...]} once it reaches Inertia's response, but the
            // frontend expects a plain array.
            'permissions' => $this->whenLoaded('permissions', fn () => $this->permissions
                ->map(fn ($permission) => (new PermissionResource($permission))->resolve())
                ->values()
                ->all()),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
