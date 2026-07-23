<?php

namespace App\Tenancy\Middleware;

use App\Tenancy\Services\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Resolves the tenant for the current request from the authenticated user
 * and binds it into the shared TenantContext so tenant-scoped models and
 * downstream authorization can rely on a single source of truth.
 */
class IdentifyTenant
{
    public function __construct(protected TenantContext $tenantContext) {}

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user) {
            $tenant = $user->tenant;

            abort_if($tenant === null, 403, 'Your account is not linked to a gym.');
            abort_if(! $tenant->isActive(), 403, 'This gym account has been suspended.');

            $this->tenantContext->set($tenant);
        }

        return $next($request);
    }
}
