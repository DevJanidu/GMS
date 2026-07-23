<?php

namespace App\Modules\AccessControl\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use App\Modules\AccessControl\Resources\PermissionResource;
use App\Shared\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Role::class);

        $permissions = Permission::query()->orderBy('group')->orderBy('name')->get();

        return ApiResponse::success(
            PermissionResource::collection($permissions)->resolve(),
        );
    }
}
