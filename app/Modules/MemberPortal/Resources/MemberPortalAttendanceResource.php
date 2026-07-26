<?php

namespace App\Modules\MemberPortal\Resources;

use App\Modules\Attendance\Models\AttendanceRecord;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

/** @mixin AttendanceRecord */
class MemberPortalAttendanceResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'source' => $this->source,
            'checked_in_at' => Carbon::parse($this->checked_in_at)->toIso8601String(),
            'checked_out_at' => $this->checked_out_at === null
                ? null
                : Carbon::parse($this->checked_out_at)->toIso8601String(),
            'branch' => $this->whenLoaded('branch', fn () => [
                'name' => $this->branch->name,
            ]),
        ];
    }
}
