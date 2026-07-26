<?php

namespace App\Modules\Attendance\Providers;

use App\Modules\Attendance\Contracts\AttendanceRecorder;
use App\Modules\Attendance\Contracts\MemberQrCardProvider;
use App\Modules\Attendance\Services\AttendanceRecorderService;
use App\Modules\Attendance\Services\MemberQrCredentialService;
use Illuminate\Support\ServiceProvider;

class AttendanceServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(AttendanceRecorder::class, AttendanceRecorderService::class);
        $this->app->bind(MemberQrCardProvider::class, MemberQrCredentialService::class);
    }
}
