<?php

namespace App\Modules\Membership\Models;

use App\Models\Concerns\BelongsToTenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MembershipStatusHistory extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id', 'membership_id', 'event_type', 'from_status', 'to_status',
        'reason', 'effective_at', 'actor_id', 'metadata',
    ];

    protected function casts(): array
    {
        return ['effective_at' => 'datetime', 'metadata' => 'array'];
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
    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }
}
