<?php

namespace App\Modules\Attendance\Enums;

enum AttendanceMode: string
{
    case CheckInOnly = 'check_in_only';
    case CheckInOut = 'check_in_out';
}
