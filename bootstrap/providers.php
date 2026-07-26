<?php

use App\Modules\Attendance\Providers\AttendanceServiceProvider;
use App\Modules\MemberPortal\Providers\MemberPortalServiceProvider;
use App\Modules\Membership\Providers\MembershipServiceProvider;
use App\Modules\Notification\Providers\NotificationServiceProvider;
use App\Modules\Report\Providers\ReportServiceProvider;
use App\Providers\AppServiceProvider;
use App\Providers\AuthorizationServiceProvider;
use App\Providers\FortifyServiceProvider;

return [
    AppServiceProvider::class,
    AuthorizationServiceProvider::class,
    FortifyServiceProvider::class,
    MembershipServiceProvider::class,
    AttendanceServiceProvider::class,
    MemberPortalServiceProvider::class,
    NotificationServiceProvider::class,
    ReportServiceProvider::class,
];
