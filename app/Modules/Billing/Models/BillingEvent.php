<?php

namespace App\Modules\Billing\Models;

use App\Models\Concerns\BelongsToTenant;
use App\Modules\Billing\Models\Concerns\ImmutableLedgerEntry;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $event_id
 * @property int $tenant_id
 * @property int|null $branch_id
 * @property string $event_type
 * @property string $aggregate_type
 * @property int $aggregate_id
 * @property array<string, mixed> $payload
 * @property CarbonImmutable $occurred_at
 * @property CarbonImmutable|null $published_at
 */
#[Fillable([
    'tenant_id', 'branch_id', 'event_type', 'aggregate_type', 'aggregate_id',
    'payload', 'occurred_at', 'published_at',
])]
class BillingEvent extends Model
{
    use BelongsToTenant, ImmutableLedgerEntry;

    protected static function booted(): void
    {
        static::creating(fn (BillingEvent $event) => $event->event_id ??= (string) Str::uuid());
    }

    protected function casts(): array
    {
        return ['payload' => 'array', 'occurred_at' => 'immutable_datetime', 'published_at' => 'immutable_datetime'];
    }
}
