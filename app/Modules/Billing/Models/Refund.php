<?php

namespace App\Modules\Billing\Models;

use App\Models\Branch;
use App\Models\Concerns\BelongsToTenant;
use App\Models\User;
use App\Modules\Billing\Database\Factories\RefundFactory;
use App\Modules\Billing\Models\Concerns\ImmutableLedgerEntry;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $public_id
 * @property int $tenant_id
 * @property int $branch_id
 * @property int $invoice_id
 * @property int $payment_id
 * @property string $refund_number
 * @property int $amount_cents
 * @property string $reason
 * @property string $idempotency_key
 * @property array<string, mixed>|null $metadata
 * @property CarbonImmutable $refunded_at
 * @property int|null $refunded_by
 * @property-read Invoice $invoice
 * @property-read Payment $payment
 */
#[Fillable([
    'tenant_id', 'branch_id', 'invoice_id', 'payment_id', 'refund_number', 'amount_cents',
    'reason', 'idempotency_key', 'metadata', 'refunded_at', 'refunded_by',
])]
class Refund extends Model
{
    /** @use HasFactory<RefundFactory> */
    use BelongsToTenant, HasFactory, ImmutableLedgerEntry;

    protected static function booted(): void
    {
        static::creating(fn (Refund $refund) => $refund->public_id ??= (string) Str::uuid());
    }

    protected static function newFactory(): RefundFactory
    {
        return RefundFactory::new();
    }

    protected function casts(): array
    {
        return ['metadata' => 'array', 'refunded_at' => 'immutable_datetime'];
    }

    /** @return BelongsTo<Invoice, $this> */
    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    /** @return BelongsTo<Payment, $this> */
    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    /** @return BelongsTo<Branch, $this> */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    /** @return BelongsTo<User, $this> */
    public function refunder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'refunded_by');
    }
}
