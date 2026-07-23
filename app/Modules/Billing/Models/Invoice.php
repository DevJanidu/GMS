<?php

namespace App\Modules\Billing\Models;

use App\Models\Branch;
use App\Models\Concerns\BelongsToTenant;
use App\Models\Member;
use App\Models\User;
use App\Modules\Membership\Models\Membership;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id', 'branch_id', 'member_id', 'membership_id', 'invoice_number',
        'status', 'currency', 'issued_on', 'due_on', 'subtotal', 'discount_amount',
        'tax_amount', 'grand_total', 'amount_paid', 'balance_due', 'idempotency_key',
        'notes', 'voided_at', 'voided_by', 'void_reason', 'created_by',
    ];

    protected function casts(): array
    {
        return [
            'issued_on' => 'date',
            'due_on' => 'date',
            'subtotal' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'grand_total' => 'decimal:2',
            'amount_paid' => 'decimal:2',
            'balance_due' => 'decimal:2',
            'voided_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Branch, $this>
     */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    /**
     * @return BelongsTo<Member, $this>
     */
    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * @return BelongsTo<Membership, $this>
     */
    public function membership(): BelongsTo
    {
        return $this->belongsTo(Membership::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function voidedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'voided_by');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return HasMany<InvoiceItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    /**
     * @return HasMany<PaymentAllocation, $this>
     */
    public function allocations(): HasMany
    {
        return $this->hasMany(PaymentAllocation::class);
    }

    /**
     * @return HasMany<InstallmentSchedule, $this>
     */
    public function installments(): HasMany
    {
        return $this->hasMany(InstallmentSchedule::class);
    }
}
