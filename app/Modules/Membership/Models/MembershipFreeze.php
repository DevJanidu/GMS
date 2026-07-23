<?php

namespace App\Modules\Membership\Models;

use App\Models\Concerns\BelongsToTenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MembershipFreeze extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id', 'membership_id', 'status', 'starts_on', 'ends_on',
        'resumed_at', 'extension_days', 'reason', 'requested_by', 'approved_by',
    ];

    protected function casts(): array
    {
        return [
            'starts_on' => 'date',
            'ends_on' => 'date',
            'resumed_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Membership, $this>
     */
    public function membership(): BelongsTo
    {
        return $this->belongsTo(Membership::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function requestedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
