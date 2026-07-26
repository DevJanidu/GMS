<?php

namespace App\Modules\MemberPortal\Providers;

use App\Modules\MemberPortal\Contracts\MemberPortalAuthorizer;
use App\Modules\MemberPortal\Contracts\MemberQrCardProvider;
use App\Modules\MemberPortal\Services\AttendanceMemberQrCardProvider;
use App\Modules\MemberPortal\Services\MemberPortalAuthorizerService;
use Illuminate\Support\ServiceProvider;

class MemberPortalServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(MemberPortalAuthorizer::class, MemberPortalAuthorizerService::class);
        $this->app->bind(MemberQrCardProvider::class, AttendanceMemberQrCardProvider::class);
    }
}
