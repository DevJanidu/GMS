<?php

namespace App\Models;

use App\Enums\DurationUnit;
use App\Enums\PlanStatus;
use App\Models\Concerns\BelongsToTenant;
use Database\Factories\PlanFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $tenant_id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string $price
 * @property string $joining_fee
 * @property int $duration_value
 * @property DurationUnit $duration_unit
 * @property array<string, mixed>|null $access_rules
 * @property bool $available_at_all_branches
 * @property PlanStatus $status
 * @property int|null $cloned_from_id
 * @property int|null $created_by
 */
#[Fillable([
    'tenant_id', 'name', 'slug', 'description', 'price', 'joining_fee', 'duration_value',
    'duration_unit', 'access_rules', 'available_at_all_branches', 'status',
])]
class Plan extends Model
{
    /** @use HasFactory<PlanFactory> */
    use BelongsToTenant, HasFactory;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'joining_fee' => 0,
    ];

    protected function casts(): array
    {
        return [
            'status' => PlanStatus::class,
            'duration_unit' => DurationUnit::class,
            'access_rules' => 'array',
            'available_at_all_branches' => 'boolean',
            'price' => 'decimal:2',
            'joining_fee' => 'decimal:2',
        ];
    }

    /**
     * @return BelongsToMany<Branch, $this>
     */
    public function branches(): BelongsToMany
    {
        return $this->belongsToMany(Branch::class, 'plan_branch')->withTimestamps();
    }

    /**
     * @return HasMany<PlanPriceHistory, $this>
     */
    public function priceHistory(): HasMany
    {
        return $this->hasMany(PlanPriceHistory::class)->orderByDesc('effective_from');
    }

    /**
     * @return BelongsTo<Plan, $this>
     */
    public function clonedFrom(): BelongsTo
    {
        return $this->belongsTo(self::class, 'cloned_from_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function isActive(): bool
    {
        return $this->status === PlanStatus::Active;
    }

    public function isAvailableAtBranch(int $branchId): bool
    {
        if ($this->available_at_all_branches) {
            return true;
        }

        return $this->relationLoaded('branches')
            ? $this->branches->contains('id', $branchId)
            : $this->branches()->whereKey($branchId)->exists();
    }
}
