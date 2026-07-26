<?php

namespace App\Modules\Billing\Models;

use App\Models\Branch;
use App\Models\Concerns\BelongsToTenant;
use App\Models\User;
use App\Modules\Billing\Database\Factories\PaymentFactory;
use App\Modules\Billing\Enums\PaymentMethod;
use App\Modules\Billing\Models\Concerns\ImmutableLedgerEntry;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $public_id
 * @property int $tenant_id
 * @property int $branch_id
 * @property int $invoice_id
 * @property string $payment_number
 * @property int $amount_cents
 * @property PaymentMethod $method
 * @property string|null $reference
 * @property string $idempotency_key
 * @property array<string, mixed>|null $metadata
 * @property CarbonImmutable $paid_at
 * @property int|null $recorded_by
 * @property int|null $refunds_sum_amount_cents
 * @property-read Invoice $invoice
 * @property-read Receipt|null $receipt
 */
#[Fillable([
    'tenant_id', 'branch_id', 'invoice_id', 'payment_number', 'amount_cents', 'method',
    'reference', 'idempotency_key', 'metadata', 'paid_at', 'recorded_by',
])]
class Payment extends Model
{
    /** @use HasFactory<PaymentFactory> */
    use BelongsToTenant, HasFactory, ImmutableLedgerEntry;

    protected static function booted(): void
    {
        static::creating(fn (Payment $payment) => $payment->public_id ??= (string) Str::uuid());
    }

    protected static function newFactory(): PaymentFactory
    {
        return PaymentFactory::new();
    }

    protected function casts(): array
    {
        return ['method' => PaymentMethod::class, 'metadata' => 'array', 'paid_at' => 'immutable_datetime'];
    }

    /** @return BelongsTo<Invoice, $this> */
    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    /** @return BelongsTo<Branch, $this> */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    /** @return BelongsTo<User, $this> */
    public function recorder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    /** @return HasMany<Refund, $this> */
    public function refunds(): HasMany
    {
        return $this->hasMany(Refund::class);
    }

    /** @return HasOne<Receipt, $this> */
    public function receipt(): HasOne
    {
        return $this->hasOne(Receipt::class);
    }
}
