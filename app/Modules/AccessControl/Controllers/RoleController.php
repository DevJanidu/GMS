<?php

namespace App\Modules\AccessControl\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Modules\AccessControl\Requests\StoreRoleRequest;
use App\Modules\AccessControl\Requests\UpdateRoleRequest;
use App\Modules\AccessControl\Resources\RoleResource;
use App\Modules\AccessControl\Services\AuditLogger;
use App\Shared\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RoleController extends Controller
{
    public function __construct(protected AuditLogger $auditLogger) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Role::class);

        $roles = Role::visibleToTenant($request->user()->tenant_id)
            ->withCount('users')
            ->with('permissions')
            ->orderBy('name')
            ->get();

        return ApiResponse::success(RoleResource::collection($roles)->resolve());
    }

    public function store(StoreRoleRequest $request): JsonResponse
    {
        $role = new Role([
            'tenant_id' => $request->user()->tenant_id,
            'name' => $request->string('name')->toString(),
            'slug' => $request->filled('slug')
                ? Str::slug($request->string('slug')->toString())
                : Str::slug($request->string('name')->toString()),
            'is_system' => false,
        ]);
        $role->save();

        $permissionIds = $request->input('permissions', []);
        $role->permissions()->sync($permissionIds);

        $this->auditLogger->log($request->user(), 'role.created', $role, ['permissions' => $permissionIds]);

        return ApiResponse::created(
            (new RoleResource($role->load('permissions')))->resolve(),
        );
    }

    public function show(Role $role): JsonResponse
    {
        $this->authorize('view', $role);

        return ApiResponse::success(
            (new RoleResource($role->loadCount('users')->load('permissions')))->resolve(),
        );
    }

    public function update(UpdateRoleRequest $request, Role $role): JsonResponse
    {
        // Belt-and-braces beneath RolePolicy::update: an owner user bypasses
        // every policy check via Gate::before, so the owner role's own
        // permissions must be protected here too, or its holder could lock
        // themselves out with no way back in.
        if ($role->slug === 'owner') {
            return ApiResponse::error('The owner role cannot be modified.', 403);
        }

        // System roles keep their built-in name/slug — only their
        // permission set can be customized, so silently ignore any
        // identity changes rather than trusting the client to withhold them.
        if (! $role->is_system) {
            $role->fill(array_filter([
                'name' => $request->string('name')->toString() ?: null,
                'slug' => $request->filled('slug') ? Str::slug($request->string('slug')->toString()) : null,
            ]));
            $role->save();
        }

        if ($request->has('permissions')) {
            $permissionIds = $request->input('permissions', []);
            $role->permissions()->sync($permissionIds);

            $this->auditLogger->log($request->user(), 'role.permissions_updated', $role, ['permissions' => $permissionIds]);
        }

        return ApiResponse::success(
            (new RoleResource($role->load('permissions')))->resolve(),
            'Role updated successfully.',
        );
    }

    public function destroy(Request $request, Role $role): JsonResponse
    {
        $this->authorize('delete', $role);

        // Same reasoning as update(): Gate::before lets an owner user bypass
        // the policy's is_system check, so guard it again here.
        if ($role->is_system) {
            return ApiResponse::error('System roles cannot be deleted.', 403);
        }

        $this->auditLogger->log($request->user(), 'role.deleted', $role);

        $role->delete();

        return ApiResponse::deleted('Role deleted successfully.');
    }
}
