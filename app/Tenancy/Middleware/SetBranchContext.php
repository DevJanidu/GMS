<?php

namespace App\Tenancy\Middleware;

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

        if ($requestedBranchId) {
            $branch = $user->branches()->whereKey($requestedBranchId)->first();

            abort_if($branch === null, 403, 'You are not assigned to this branch.');
        } else {
            $branch = $user->branches()->wherePivot('is_primary', true)->first()
                ?? $user->branches()->first();
        }

        $this->branchContext->set($branch);

        return $next($request);
    }
}
