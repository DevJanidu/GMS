<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\PlanPriceHistoryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $plan_id
 * @property string $price
 * @property string $joining_fee
 * @property CarbonImmutable $effective_from
 * @property CarbonImmutable|null $effective_until
 * @property int|null $changed_by
 */
#[Fillable(['plan_id', 'price', 'joining_fee', 'effective_from', 'effective_until', 'changed_by'])]
class PlanPriceHistory extends Model
{
    /** @use HasFactory<PlanPriceHistoryFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'joining_fee' => 'decimal:2',
            'effective_from' => 'datetime',
            'effective_until' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Plan, $this>
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
