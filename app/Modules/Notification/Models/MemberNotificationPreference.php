<?php

namespace App\Modules\Notification\Models;

use App\Models\Concerns\BelongsToTenant;
use App\Models\Member;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MemberNotificationPreference extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id', 'member_id', 'channel', 'notification_type', 'enabled', 'settings',
    ];

    protected function casts(): array
    {
        return ['enabled' => 'boolean', 'settings' => 'array'];
    }

    /**
     * @return BelongsTo<Member, $this>
     */
    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }
}
