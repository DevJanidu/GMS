<?php

namespace App\Modules\Attendance\Enums;

enum AttendanceSource: string
{
    case PhoneCamera = 'phone_camera';
    case Manual = 'manual';
}
