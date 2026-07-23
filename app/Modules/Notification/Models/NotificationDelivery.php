<?php

namespace App\Modules\Notification\Models;

use App\Models\Concerns\BelongsToTenant;
use App\Models\Member;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NotificationDelivery extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id', 'notification_id', 'template_id', 'rule_id', 'announcement_id',
        'member_id', 'channel', 'recipient', 'provider', 'provider_message_id',
        'status', 'attempt_count', 'idempotency_key', 'scheduled_at', 'sent_at',
        'delivered_at', 'failed_at', 'failure_reason', 'payload',
    ];

    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'scheduled_at' => 'datetime',
            'sent_at' => 'datetime',
            'delivered_at' => 'datetime',
            'failed_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<InAppNotification, $this>
     */
    public function notification(): BelongsTo
    {
        return $this->belongsTo(InAppNotification::class, 'notification_id');
    }

    /**
     * @return BelongsTo<NotificationTemplate, $this>
     */
    public function template(): BelongsTo
    {
        return $this->belongsTo(NotificationTemplate::class, 'template_id');
    }

    /**
     * @return BelongsTo<NotificationRule, $this>
     */
    public function rule(): BelongsTo
    {
        return $this->belongsTo(NotificationRule::class, 'rule_id');
    }

    /**
     * @return BelongsTo<Announcement, $this>
     */
    public function announcement(): BelongsTo
    {
        return $this->belongsTo(Announcement::class);
    }

    /**
     * @return BelongsTo<Member, $this>
     */
    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * @return HasMany<NotificationDeliveryAttempt, $this>
     */
    public function attempts(): HasMany
    {
        return $this->hasMany(NotificationDeliveryAttempt::class, 'delivery_id');
    }
}
