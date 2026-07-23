<?php

namespace App\Modules\Branch\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Modules\Branch\Requests\StoreBranchRequest;
use App\Modules\Branch\Requests\UpdateBranchRequest;
use App\Modules\Branch\Requests\UpdateOpeningHoursRequest;
use App\Modules\Branch\Resources\BranchResource;
use App\Shared\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Branch::class);

        $branches = Branch::query()
            ->withCount('users')
            ->when($request->string('search')->toString(), fn ($query, $search) => $query->where(fn ($q) => $q
                ->where('name', 'like', "%{$search}%")
                ->orWhere('code', 'like', "%{$search}%")
            ))
            ->when($request->string('status')->toString(), fn ($query, $status) => $query->where('status', $status))
            ->orderBy('name')
            ->paginate($request->integer('per_page', 15));

        return ApiResponse::paginated($branches->through(fn (Branch $branch) => (new BranchResource($branch))->resolve()));
    }

    public function store(StoreBranchRequest $request): JsonResponse
    {
        $branch = Branch::create($request->validated());

        return ApiResponse::created((new BranchResource($branch))->resolve());
    }

    public function show(Branch $branch): JsonResponse
    {
        $this->authorize('view', $branch);

        return ApiResponse::success((new BranchResource($branch->loadCount('users')))->resolve());
    }

    public function update(UpdateBranchRequest $request, Branch $branch): JsonResponse
    {
        $branch->update($request->validated());

        return ApiResponse::success((new BranchResource($branch))->resolve(), 'Branch updated successfully.');
    }

    public function destroy(Branch $branch): JsonResponse
    {
        $this->authorize('delete', $branch);

        $branch->delete();

        return ApiResponse::deleted('Branch deleted successfully.');
    }

    public function updateOpeningHours(UpdateOpeningHoursRequest $request, Branch $branch): JsonResponse
    {
        $branch->update(['opening_hours' => $request->validated('opening_hours')]);

        return ApiResponse::success(
            (new BranchResource($branch))->resolve(),
            'Opening hours updated successfully.',
        );
    }
}
