<?php

namespace App\Modules\MemberPortal\Providers;

use App\Modules\MemberPortal\Contracts\MemberPortalAuthorizer;
use App\Modules\MemberPortal\Contracts\MemberQrCardProvider;
use App\Modules\MemberPortal\Services\MemberPortalAuthorizerService;
use App\Modules\MemberPortal\Services\UnavailableMemberQrCardProvider;
use Illuminate\Support\ServiceProvider;

class MemberPortalServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(MemberPortalAuthorizer::class, MemberPortalAuthorizerService::class);
        $this->app->bindIf(MemberQrCardProvider::class, UnavailableMemberQrCardProvider::class);
    }
}
