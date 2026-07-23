<?php

namespace App\Modules\Billing\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InstallmentSchedule extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id', 'invoice_id', 'installment_number', 'due_on',
        'amount_due', 'amount_paid', 'status',
    ];

    protected function casts(): array
    {
        return ['due_on' => 'date', 'amount_due' => 'decimal:2', 'amount_paid' => 'decimal:2'];
    }

    /**
     * @return BelongsTo<Invoice, $this>
     */
    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }
}
