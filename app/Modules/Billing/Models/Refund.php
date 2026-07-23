<?php

namespace App\Modules\Billing\Models;

use App\Models\Concerns\BelongsToTenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Refund extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id', 'payment_id', 'refund_number', 'status', 'amount', 'reason',
        'external_reference', 'idempotency_key', 'refunded_at', 'processed_by', 'metadata',
    ];

    protected function casts(): array
    {
        return ['amount' => 'decimal:2', 'refunded_at' => 'datetime', 'metadata' => 'array'];
    }

    /**
     * @return BelongsTo<Payment, $this>
     */
    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function processedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    /**
     * @return HasMany<Receipt, $this>
     */
    public function receipts(): HasMany
    {
        return $this->hasMany(Receipt::class);
    }
}
