<?php

namespace App\Modules\MemberPortal\Models;

use App\Models\Concerns\BelongsToTenant;
use App\Models\Member;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MemberPortalAccount extends Model
{
    use BelongsToTenant;

    public const STATUS_ACTIVE = 'active';

    public const STATUS_INVITED = 'invited';

    public const STATUS_SUSPENDED = 'suspended';

    protected $fillable = [
        'tenant_id', 'member_id', 'user_id', 'status', 'invited_at',
        'activated_at', 'last_login_at', 'suspended_at',
    ];

    protected function casts(): array
    {
        return [
            'invited_at' => 'datetime',
            'activated_at' => 'datetime',
            'last_login_at' => 'datetime',
            'suspended_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Member, $this>
     */
    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE
            && $this->user_id !== null
            && $this->suspended_at === null;
    }
}
