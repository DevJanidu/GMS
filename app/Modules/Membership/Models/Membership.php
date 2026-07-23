<?php

namespace App\Modules\Membership\Models;

use App\Models\Branch;
use App\Models\Concerns\BelongsToTenant;
use App\Models\Member;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Membership extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id', 'member_id', 'plan_id', 'branch_id', 'renewed_from_id',
        'membership_number', 'status', 'currency', 'plan_price', 'joining_fee',
        'discount_amount', 'tax_amount', 'total_amount', 'starts_on', 'ends_on',
        'grace_ends_on', 'sold_at', 'activated_at', 'terminated_at',
        'plan_snapshot', 'access_rules_snapshot', 'created_by',
    ];

    protected function casts(): array
    {
        return [
            'plan_price' => 'decimal:2',
            'joining_fee' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'starts_on' => 'date',
            'ends_on' => 'date',
            'grace_ends_on' => 'date',
            'sold_at' => 'datetime',
            'activated_at' => 'datetime',
            'terminated_at' => 'datetime',
            'plan_snapshot' => 'array',
            'access_rules_snapshot' => 'array',
        ];
    }

    /**
     * @return BelongsTo<Member, $this>
     */
    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * @return BelongsTo<Plan, $this>
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    /**
     * @return BelongsTo<Branch, $this>
     */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    /**
     * @return BelongsTo<self, $this>
     */
    public function renewedFrom(): BelongsTo
    {
        return $this->belongsTo(self::class, 'renewed_from_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return HasMany<MembershipStatusHistory, $this>
     */
    public function statusHistory(): HasMany
    {
        return $this->hasMany(MembershipStatusHistory::class);
    }

    /**
     * @return HasMany<MembershipFreeze, $this>
     */
    public function freezes(): HasMany
    {
        return $this->hasMany(MembershipFreeze::class);
    }
}
