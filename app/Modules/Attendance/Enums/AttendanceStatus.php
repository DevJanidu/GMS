<?php

namespace App\Modules\Attendance\Enums;

enum AttendanceStatus: string
{
    case CheckedIn = 'checked_in';
    case CheckedOut = 'checked_out';
    case Reversed = 'reversed';
}
