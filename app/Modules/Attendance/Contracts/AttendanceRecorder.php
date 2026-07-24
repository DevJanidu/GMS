<?php

namespace App\Modules\Attendance\Contracts;

use App\Modules\Attendance\DTOs\AttendanceCommand;
use App\Modules\Attendance\DTOs\AttendanceResult;

interface AttendanceRecorder
{
    public function record(AttendanceCommand $command): AttendanceResult;
}
