<?php

namespace App\Modules\Notification\Models;

use App\Models\Branch;
use App\Models\Concerns\BelongsToTenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NotificationTemplate extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id', 'branch_id', 'name', 'key', 'channel', 'locale', 'subject', 'body',
        'variables', 'status', 'created_by',
    ];

    protected function casts(): array
    {
        return ['variables' => 'array'];
    }

    /** @return BelongsTo<Branch, $this> */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return HasMany<NotificationRule, $this>
     */
    public function rules(): HasMany
    {
        return $this->hasMany(NotificationRule::class, 'template_id');
    }
}
