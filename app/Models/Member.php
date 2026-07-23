<?php

namespace App\Models;

use App\Enums\MemberStatus;
use App\Models\Concerns\BelongsToTenant;
use Carbon\CarbonImmutable;
use Database\Factories\MemberFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
