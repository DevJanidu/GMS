<?php

namespace App\Modules\MemberPortal\Middleware;

use App\Modules\MemberPortal\Services\MemberPortalAuthorizerService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureMemberPortalAccess
{
    public function __construct(private MemberPortalAuthorizerService $authorizer) {}

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        abort_if($user === null, 401);

        $account = $this->authorizer->accountFor($user);
        $request->attributes->set('memberPortalAccount', $account);

        return $next($request);
    }
}
