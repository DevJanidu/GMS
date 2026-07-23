<?php

namespace App\Modules\Membership\Models;

use App\Models\Branch;
use App\Models\Concerns\BelongsToTenant;
use App\Models\Member;
use App\Models\Plan;
use App\Models\User;
use App\Modules\Membership\Enums\MembershipStatus;
use Carbon\CarbonImmutable;
use Database\Factories\MembershipFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use RuntimeException;

/**
 * @property int $id
 * @property int $tenant_id
 * @property int $branch_id
 * @property int $member_id
 * @property int|null $plan_id
 * @property string $plan_name_snapshot
 * @property string $plan_price_snapshot
 * @property string $plan_joining_fee_snapshot
 * @property int $plan_duration_value_snapshot
 * @property string $plan_duration_unit_snapshot
 * @property array<string, mixed>|null $plan_access_rules_snapshot
 * @property CarbonImmutable $starts_on
 * @property CarbonImmutable $expires_on
 * @property int $grace_days
 * @property CarbonImmutable $grace_ends_on
 * @property MembershipStatus $status
 * @property int|null $previous_membership_id
 * @property int|null $sold_by
 * @property CarbonImmutable|null $sold_at
 * @property int|null $invoice_id
 * @property CarbonImmutable|null $freeze_started_on
 * @property CarbonImmutable|null $freeze_resumes_on
 * @property int $frozen_days_used
 * @property CarbonImmutable|null $suspended_at
 * @property string|null $suspension_reason
 * @property CarbonImmutable|null $cancelled_at
 * @property string|null $cancellation_reason
 * @property CarbonImmutable|null $expiring_notified_at
 * @property CarbonImmutable|null $expired_at
 * @property string|null $notes
 * @property int|null $created_by
 */
#[Fillable([
    'tenant_id', 'branch_id', 'member_id', 'plan_id',
    'plan_name_snapshot', 'plan_price_snapshot', 'plan_joining_fee_snapshot',
    'plan_duration_value_snapshot', 'plan_duration_unit_snapshot', 'plan_access_rules_snapshot',
    'starts_on', 'expires_on', 'grace_days', 'grace_ends_on', 'status',
    'previous_membership_id', 'sold_by', 'sold_at', 'invoice_id',
    'freeze_started_on', 'freeze_resumes_on', 'frozen_days_used',
    'suspended_at', 'suspension_reason', 'cancelled_at', 'cancellation_reason',
    'expiring_notified_at', 'expired_at', 'notes', 'created_by',
])]
class Membership extends Model
{
    /** @use HasFactory<MembershipFactory> */
    use BelongsToTenant, HasFactory;

    protected static function newFactory(): MembershipFactory
    {
        return MembershipFactory::new();
    }

    protected static function booted(): void
    {
        // Membership history must never be destroyed — statuses only ever
        // move forward through the lifecycle (cancel/expire instead of
        // delete), so historical reporting always reconciles.
        static::deleting(function () {
            throw new RuntimeException('Memberships cannot be deleted; cancel or let it expire instead.');
        });
    }

    protected function casts(): array
    {
        return [
            'status' => MembershipStatus::class,
            'plan_price_snapshot' => 'decimal:2',
            'plan_joining_fee_snapshot' => 'decimal:2',
            'plan_access_rules_snapshot' => 'array',
            'starts_on' => 'date',
            'expires_on' => 'date',
            'grace_ends_on' => 'date',
            'sold_at' => 'datetime',
            'freeze_started_on' => 'date',
            'freeze_resumes_on' => 'date',
            'suspended_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'expiring_notified_at' => 'datetime',
            'expired_at' => 'datetime',
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
     * @return BelongsTo<Plan, $this>
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    /**
     * @return BelongsTo<Membership, $this>
     */
    public function previousMembership(): BelongsTo
    {
        return $this->belongsTo(self::class, 'previous_membership_id');
    }

    /**
     * The membership that renewed this one, if any.
     *
     * @return HasOne<Membership, $this>
     */
    public function renewal(): HasOne
    {
        return $this->hasOne(self::class, 'previous_membership_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function soldBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sold_by');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return HasMany<MembershipEvent, $this>
     */
    public function events(): HasMany
    {
        return $this->hasMany(MembershipEvent::class)->orderByDesc('occurred_at')->orderByDesc('id');
    }

    public function hasForwardRenewal(): bool
    {
        return $this->relationLoaded('renewal')
            ? $this->renewal !== null
            : $this->renewal()->exists();
    }

    public function isInGracePeriod(?CarbonImmutable $at = null): bool
    {
        $today = ($at ?? CarbonImmutable::now())->startOfDay();

        return $this->status === MembershipStatus::Active
            && $today->greaterThan($this->expires_on)
            && ! $today->greaterThan($this->grace_ends_on);
    }
}
