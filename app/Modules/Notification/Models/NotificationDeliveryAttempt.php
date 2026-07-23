<?php

namespace App\Modules\Notification\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationDeliveryAttempt extends Model
{
    use BelongsToTenant;

    public $timestamps = false;

    protected $fillable = [
        'tenant_id', 'delivery_id', 'attempt_number', 'status', 'provider',
        'provider_message_id', 'provider_response', 'failure_reason', 'attempted_at',
    ];

    protected function casts(): array
    {
        return ['provider_response' => 'array', 'attempted_at' => 'datetime'];
    }

    /**
     * @return BelongsTo<NotificationDelivery, $this>
     */
    public function delivery(): BelongsTo
    {
        return $this->belongsTo(NotificationDelivery::class, 'delivery_id');
    }
}
