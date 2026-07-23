<?php

namespace App\Modules\Notification\Models;

use App\Models\Concerns\BelongsToTenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationRule extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id', 'template_id', 'name', 'event_type', 'channel', 'status',
        'offset_minutes', 'conditions', 'schedule', 'created_by',
    ];

    protected function casts(): array
    {
        return ['conditions' => 'array', 'schedule' => 'array'];
    }

    /**
     * @return BelongsTo<NotificationTemplate, $this>
     */
    public function template(): BelongsTo
    {
        return $this->belongsTo(NotificationTemplate::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
