<?php

namespace App\Modules\Attendance\Models;

use App\Models\Branch;
use App\Models\Concerns\BelongsToTenant;
use App\Models\Member;
use App\Models\User;
use App\Modules\Membership\Models\Membership;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AttendanceRecord extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id', 'branch_id', 'member_id', 'membership_id', 'qr_credential_id',
        'request_id', 'status', 'source', 'checked_in_at', 'checked_out_at',
        'device_id', 'recorded_by', 'override_by', 'override_reason', 'metadata',
    ];

    protected function casts(): array
    {
        return ['checked_in_at' => 'datetime', 'checked_out_at' => 'datetime', 'metadata' => 'array'];
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
     * @return BelongsTo<Membership, $this>
     */
    public function membership(): BelongsTo
    {
        return $this->belongsTo(Membership::class);
    }

    /**
     * @return BelongsTo<MemberQrCredential, $this>
     */
    public function qrCredential(): BelongsTo
    {
        return $this->belongsTo(MemberQrCredential::class, 'qr_credential_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function recordedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function overriddenBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'override_by');
    }

    /**
     * @return HasMany<AttendanceCorrection, $this>
     */
    public function corrections(): HasMany
    {
        return $this->hasMany(AttendanceCorrection::class);
    }
}
