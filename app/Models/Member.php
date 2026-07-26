<?php

namespace App\Models;

use App\Enums\MemberStatus;
use App\Models\Concerns\BelongsToTenant;
use App\Modules\Billing\Models\Invoice;
use App\Modules\Billing\Models\Payment;
use App\Modules\Membership\Models\Membership;
use App\Modules\MemberPortal\Models\MemberPortalAccount;
use Carbon\CarbonImmutable;
use Database\Factories\MemberFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property int $tenant_id
 * @property int|null $branch_id
 * @property string $member_number
 * @property string $first_name
 * @property string $last_name
 * @property string|null $email
 * @property string|null $phone
 * @property string|null $gender
 * @property CarbonImmutable|null $date_of_birth
 * @property string|null $address
 * @property string|null $emergency_contact_name
 * @property string|null $emergency_contact_phone
 * @property string|null $photo_path
 * @property MemberStatus $status
 * @property string|null $notes
 * @property CarbonImmutable $joined_at
 * @property CarbonImmutable|null $archived_at
 * @property int|null $created_by
 */
#[Fillable([
    'tenant_id', 'branch_id', 'first_name', 'last_name', 'email', 'phone', 'gender',
    'date_of_birth', 'address', 'emergency_contact_name', 'emergency_contact_phone',
    'notes', 'joined_at',
])]
class Member extends Model
{
    /** @use HasFactory<MemberFactory> */
    use BelongsToTenant, HasFactory;

    protected function casts(): array
    {
        return [
            'status' => MemberStatus::class,
            'date_of_birth' => 'date',
            'joined_at' => 'date',
            'archived_at' => 'datetime',
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
     * @return BelongsTo<User, $this>
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return HasMany<MemberDocument, $this>
     */
    public function documents(): HasMany
    {
        return $this->hasMany(MemberDocument::class);
    }

    /**
     * @return HasOne<MemberPortalAccount, $this>
     */
    public function portalAccount(): HasOne
    {
        return $this->hasOne(MemberPortalAccount::class);
    }

    /**
     * @return HasMany<Membership, $this>
     */
    public function memberships(): HasMany
    {
        return $this->hasMany(Membership::class)->latest('sold_at');
    }

    /**
     * @return HasMany<Invoice, $this>
     */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    /**
     * @return HasManyThrough<Payment, Invoice, $this>
     */
    public function payments(): HasManyThrough
    {
        return $this->hasManyThrough(Payment::class, Invoice::class)->latest('paid_at');
    }

    public function fullName(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    public function photoUrl(): ?string
    {
        return $this->photo_path ? Storage::disk('public')->url($this->photo_path) : null;
    }

    public function isActive(): bool
    {
        return $this->status === MemberStatus::Active;
    }

    public function isArchived(): bool
    {
        return $this->status === MemberStatus::Archived;
    }
}
