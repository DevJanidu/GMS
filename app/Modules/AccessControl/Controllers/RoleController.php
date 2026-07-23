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
        $role->fill(array_filter([
            'name' => $request->string('name')->toString() ?: null,
            'slug' => $request->filled('slug') ? Str::slug($request->string('slug')->toString()) : null,
        ]));
        $role->save();

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

        $this->auditLogger->log($request->user(), 'role.deleted', $role);

        $role->delete();

        return ApiResponse::deleted('Role deleted successfully.');
    }
}
