<?php

namespace App\Modules\Billing\Models;

use App\Models\Concerns\BelongsToTenant;
use App\Modules\Billing\Models\Concerns\ImmutableLedgerEntry;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $tenant_id
 * @property int $invoice_id
 * @property string $description
 * @property string $item_type
 * @property int $quantity
 * @property int $unit_price_cents
 * @property int $line_total_cents
 * @property array<string, mixed>|null $metadata
 */
#[Fillable([
    'tenant_id', 'invoice_id', 'description', 'item_type', 'quantity',
    'unit_price_cents', 'line_total_cents', 'metadata',
])]
class InvoiceItem extends Model
{
    use BelongsToTenant, ImmutableLedgerEntry;

    protected function casts(): array
    {
        return ['metadata' => 'array'];
    }

    /** @return BelongsTo<Invoice, $this> */
    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }
}
