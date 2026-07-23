<?php

namespace App\Modules\Billing\Models;

use App\Models\Branch;
use App\Models\Concerns\BelongsToTenant;
use App\Models\Member;
use App\Models\User;
use App\Modules\Billing\Database\Factories\InvoiceFactory;
use App\Modules\Billing\Enums\DiscountType;
use App\Modules\Billing\Enums\InvoiceStatus;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $public_id
 * @property int $tenant_id
 * @property int $branch_id
 * @property int|null $member_id
 * @property int|null $membership_id
 * @property string $invoice_number
 * @property InvoiceStatus $status
 * @property string $currency
 * @property CarbonImmutable $issued_on
 * @property CarbonImmutable|null $due_on
 * @property int $subtotal_cents
 * @property DiscountType|null $discount_type
 * @property int $discount_value
 * @property int $discount_cents
 * @property int $tax_rate_basis_points
 * @property int $tax_cents
 * @property int $joining_fee_cents
 * @property int $grand_total_cents
 * @property int $amount_paid_cents
 * @property int $amount_refunded_cents
 * @property int $balance_due_cents
 * @property string|null $notes
 * @property string|null $idempotency_key
 * @property string|null $idempotency_hash
 * @property int|null $created_by
 * @property CarbonImmutable|null $voided_at
 * @property int|null $voided_by
 * @property string|null $void_reason
 * @property-read Branch $branch
 * @property-read Member|null $member
 * @property-read Collection<int, InvoiceItem> $items
 * @property-read Collection<int, Payment> $payments
 * @property-read Collection<int, Refund> $refunds
 * @property-read Collection<int, Receipt> $receipts
 */
#[Fillable([
    'tenant_id', 'branch_id', 'member_id', 'membership_id', 'invoice_number', 'status',
    'currency', 'issued_on', 'due_on', 'subtotal_cents', 'discount_type', 'discount_value',
    'discount_cents', 'tax_rate_basis_points', 'tax_cents', 'joining_fee_cents',
    'grand_total_cents', 'amount_paid_cents', 'amount_refunded_cents', 'balance_due_cents',
    'notes', 'idempotency_key', 'idempotency_hash', 'created_by', 'voided_at', 'voided_by', 'void_reason',
])]
class Invoice extends Model
{
    /** @use HasFactory<InvoiceFactory> */
    use BelongsToTenant, HasFactory;

    protected static function booted(): void
    {
        static::creating(function (Invoice $invoice): void {
            $invoice->public_id ??= (string) Str::uuid();
        });
        static::deleting(fn () => throw new \LogicException('Invoices cannot be deleted; void them instead.'));
    }

    protected static function newFactory(): InvoiceFactory
    {
        return InvoiceFactory::new();
    }

    protected function casts(): array
    {
        return [
            'status' => InvoiceStatus::class,
            'discount_type' => DiscountType::class,
            'issued_on' => 'date',
            'due_on' => 'date',
            'voided_at' => 'immutable_datetime',
        ];
    }

    /** @return BelongsTo<Branch, $this> */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    /** @return BelongsTo<Member, $this> */
    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /** @return HasMany<InvoiceItem, $this> */
    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    /** @return HasMany<Payment, $this> */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /** @return HasMany<Refund, $this> */
    public function refunds(): HasMany
    {
        return $this->hasMany(Refund::class);
    }

    /** @return HasMany<Receipt, $this> */
    public function receipts(): HasMany
    {
        return $this->hasMany(Receipt::class);
    }

    public function isVoid(): bool
    {
        return $this->status === InvoiceStatus::Void;
    }
}
