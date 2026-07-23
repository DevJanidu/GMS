<?php

namespace App\Modules\Membership\Models;

use App\Models\Concerns\BelongsToTenant;
use App\Models\User;
use App\Modules\Membership\Enums\MembershipEventType;
use Carbon\CarbonImmutable;
use Database\Factories\MembershipEventFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use RuntimeException;

/**
 * Append-only membership lifecycle event. Never updated or deleted, so a
 * membership's full history can always be reconstructed and reported on.
 *
 * @property int $id
 * @property int $tenant_id
 * @property int $membership_id
 * @property MembershipEventType $type
 * @property string|null $from_status
 * @property string|null $to_status
 * @property CarbonImmutable $occurred_at
 * @property int|null $actor_id
 * @property array<string, mixed>|null $metadata
 */
#[Fillable([
    'tenant_id', 'membership_id', 'type', 'from_status', 'to_status',
    'occurred_at', 'actor_id', 'metadata',
])]
class MembershipEvent extends Model
{
    /** @use HasFactory<MembershipEventFactory> */
    use BelongsToTenant, HasFactory;

    const UPDATED_AT = null;

    protected static function newFactory(): MembershipEventFactory
    {
        return MembershipEventFactory::new();
    }

    protected static function booted(): void
    {
        static::updating(function () {
            throw new RuntimeException('Membership events are append-only and cannot be updated.');
        });

        static::deleting(function () {
            throw new RuntimeException('Membership events are append-only and cannot be deleted.');
        });
    }

    protected function casts(): array
    {
        return [
            'type' => MembershipEventType::class,
            'occurred_at' => 'datetime',
            'metadata' => 'array',
        ];
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
    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }
}
