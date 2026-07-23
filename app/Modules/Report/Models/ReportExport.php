<?php

namespace App\Modules\Report\Models;

use App\Models\Branch;
use App\Models\Concerns\BelongsToTenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportExport extends Model
{
    use BelongsToTenant, HasUuids;

    protected $fillable = [
        'id', 'tenant_id', 'branch_id', 'requested_by', 'report_key', 'format',
        'status', 'filters', 'disk', 'file_path', 'row_count', 'started_at',
        'completed_at', 'expires_at', 'downloaded_at', 'failure_reason',
    ];

    protected function casts(): array
    {
        return [
            'filters' => 'array',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
            'expires_at' => 'datetime',
            'downloaded_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Branch, $this>
     */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function requestedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }
}
