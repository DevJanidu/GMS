<?php

namespace App\Modules\Staff\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Modules\AccessControl\Services\AuditLogger;
use App\Modules\Staff\Models\StaffProfile;
use App\Modules\Staff\Notifications\StaffInvitationNotification;
use App\Modules\Staff\Requests\AssignBranchesRequest;
use App\Modules\Staff\Requests\InviteStaffRequest;
use App\Modules\Staff\Requests\UpdateStaffRequest;
use App\Modules\Staff\Resources\StaffResource;
use App\Shared\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StaffController extends Controller
{
    public function __construct(protected AuditLogger $auditLogger) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', User::class);

        $staff = User::query()
            ->where('tenant_id', $request->user()->tenant_id)
            ->with(['staffProfile', 'roles', 'branches'])
            ->withCount('branches')
            ->when($request->string('search')->toString(), fn ($query, $search) => $query->where(fn ($q) => $q
                ->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
            ))
            ->when($request->string('status')->toString(), fn ($query, $status) => $query->where('status', $status))
            ->when($request->integer('branch_id'), fn ($query, $branchId) => $query
                ->whereHas('branches', fn ($q) => $q->where('branches.id', $branchId)))
            ->orderBy('name')
            ->paginate($request->integer('per_page', 15));

        return ApiResponse::paginated($staff->through(fn (User $user) => (new StaffResource($user))->resolve()));
    }

    public function store(InviteStaffRequest $request): JsonResponse
    {
        $inviter = $request->user();

        $staff = DB::transaction(function () use ($request, $inviter) {
            $user = User::create([
                'tenant_id' => $inviter->tenant_id,
                'name' => $request->string('name')->toString(),
                'email' => $request->string('email')->toString(),
                'password' => Str::password(40),
                'status' => 'invited',
            ]);

            StaffProfile::create([
                'tenant_id' => $inviter->tenant_id,
                'user_id' => $user->id,
                'invited_by' => $inviter->id,
                'job_title' => $request->string('job_title')->toString() ?: null,
                'phone' => $request->string('phone')->toString() ?: null,
                'invited_at' => now(),
            ]);

            $user->roles()->attach($request->integer('role_id'));

            $branchIds = $request->array('branch_ids');

            if (! empty($branchIds)) {
                $primaryBranchId = $request->integer('primary_branch_id') ?: $branchIds[0];

                $user->branches()->attach(collect($branchIds)->mapWithKeys(fn ($id) => [
                    $id => ['is_primary' => (int) $id === (int) $primaryBranchId],
                ])->all());
            }

            return $user;
        });

        $staff->notify(new StaffInvitationNotification($inviter->tenant));

        $this->auditLogger->log($inviter, 'staff.invited', $staff, ['role_id' => $request->integer('role_id')]);

        return ApiResponse::created(
            (new StaffResource($staff->load(['staffProfile', 'roles', 'branches'])))->resolve(),
        );
    }

    public function show(User $staff): JsonResponse
    {
        $this->authorize('view', $staff);

        return ApiResponse::success(
            (new StaffResource($staff->load(['staffProfile', 'roles', 'branches'])))->resolve(),
        );
    }

    public function update(UpdateStaffRequest $request, User $staff): JsonResponse
    {
        $staff->fill(array_filter([
            'name' => $request->string('name')->toString() ?: null,
        ]));
        $staff->save();

        $staff->staffProfile()->updateOrCreate(
            ['tenant_id' => $staff->tenant_id, 'user_id' => $staff->id],
            array_filter([
                'job_title' => $request->has('job_title') ? $request->string('job_title')->toString() : null,
                'phone' => $request->has('phone') ? $request->string('phone')->toString() : null,
            ], fn ($value) => $value !== null),
        );

        if ($request->filled('role_id')) {
            $staff->roles()->sync([$request->integer('role_id')]);
        }

        return ApiResponse::success(
            (new StaffResource($staff->fresh(['staffProfile', 'roles', 'branches'])))->resolve(),
            'Staff member updated successfully.',
        );
    }

    public function destroy(User $staff): JsonResponse
    {
        $this->authorize('delete', $staff);

        $staff->delete();

        return ApiResponse::deleted('Staff member removed successfully.');
    }

    public function suspend(Request $request, User $staff): JsonResponse
    {
        $this->authorize('suspend', $staff);

        $staff->update(['status' => 'suspended']);

        DB::table('sessions')->where('user_id', $staff->id)->delete();

        $this->auditLogger->log($request->user(), 'staff.suspended', $staff);

        return ApiResponse::success((new StaffResource($staff))->resolve(), 'Staff member suspended.');
    }

    public function activate(Request $request, User $staff): JsonResponse
    {
        $this->authorize('suspend', $staff);

        $staff->update(['status' => 'active']);

        $this->auditLogger->log($request->user(), 'staff.activated', $staff);

        return ApiResponse::success((new StaffResource($staff))->resolve(), 'Staff member activated.');
    }

    public function assignBranches(AssignBranchesRequest $request, User $staff): JsonResponse
    {
        $branchIds = $request->array('branch_ids');
        $primaryBranchId = $request->integer('primary_branch_id') ?: ($branchIds[0] ?? null);

        $staff->branches()->sync(collect($branchIds)->mapWithKeys(fn ($id) => [
            $id => ['is_primary' => (int) $id === (int) $primaryBranchId],
        ])->all());

        return ApiResponse::success(
            (new StaffResource($staff->fresh(['staffProfile', 'roles', 'branches'])))->resolve(),
            'Branch assignments updated.',
        );
    }
}
