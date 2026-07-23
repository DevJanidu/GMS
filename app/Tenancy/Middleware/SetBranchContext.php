<?php

namespace App\Tenancy\Middleware;

use App\Models\Branch;
use App\Tenancy\Services\BranchContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Resolves the branch a staff member is currently acting in, from an
 * explicit request hint (header/query) or their assigned branches,
 * and binds it into the shared BranchContext.
 */
class SetBranchContext
{
    public function __construct(protected BranchContext $branchContext) {}

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        $requestedBranchId = $request->header('X-Branch-Id') ?? $request->query('branch_id');
        $isOwner = $user->hasRole('owner');

        if ($requestedBranchId) {
            $branch = $isOwner
                ? Branch::query()
                    ->where('tenant_id', $user->tenant_id)
                    ->whereKey($requestedBranchId)
                    ->first()
                : $user->branches()->whereKey($requestedBranchId)->first();

            abort_if($branch === null, 403, 'You are not assigned to this branch.');
        } else {
            $branch = $user->branches()->wherePivot('is_primary', true)->first()
                ?? $user->branches()->first();

            if ($branch === null && $isOwner) {
                $branch = Branch::query()
                    ->where('tenant_id', $user->tenant_id)
                    ->orderBy('id')
                    ->first();
            }
        }

        $this->branchContext->set($branch);

        return $next($request);
    }
}
