<?php

namespace App\Modules\Billing\Models;

use App\Models\Branch;
use App\Models\Concerns\BelongsToTenant;
use App\Models\User;
use App\Modules\Billing\Models\Concerns\ImmutableLedgerEntry;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
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
 * @property string $receipt_number
 * @property array{invoice_number:string,payment_number:string,member:string|null,branch:string|null,currency:string,amount_cents:int,method:string,reference:string|null,paid_at:string,invoice_total_cents:int,balance_due_cents:int,items:list<array{description:string,quantity:int,unit_price_cents:int,line_total_cents:int}>} $snapshot
 * @property CarbonImmutable $generated_at
 * @property int|null $generated_by
 * @property-read Invoice $invoice
 * @property-read Payment $payment
 */
#[Fillable([
    'tenant_id', 'branch_id', 'invoice_id', 'payment_id', 'receipt_number',
    'snapshot', 'generated_at', 'generated_by',
])]
class Receipt extends Model
{
    use BelongsToTenant, ImmutableLedgerEntry;

    protected static function booted(): void
    {
        static::creating(fn (Receipt $receipt) => $receipt->public_id ??= (string) Str::uuid());
    }

    protected function casts(): array
    {
        return ['snapshot' => 'array', 'generated_at' => 'immutable_datetime'];
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
    public function generator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}
