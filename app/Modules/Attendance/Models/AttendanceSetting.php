<?php

namespace App\Modules\Attendance\Models;

use App\Models\Branch;
use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttendanceSetting extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id', 'branch_id', 'mode', 'duplicate_window_seconds',
        'allow_manual_entry', 'manager_override_required', 'visit_limit_rules',
    ];

    protected function casts(): array
    {
        return [
            'allow_manual_entry' => 'boolean',
            'manager_override_required' => 'boolean',
            'visit_limit_rules' => 'array',
        ];
    }

    /**
     * @return BelongsTo<Branch, $this>
     */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }
}
