<?php

namespace App\Modules\Attendance\Models;

use App\Models\Concerns\BelongsToTenant;
use App\Models\Member;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MemberQrCredential extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id', 'member_id', 'public_id', 'token_hash', 'issued_at',
        'expires_at', 'revoked_at', 'issued_by',
    ];

    protected $hidden = ['token_hash'];

    protected function casts(): array
    {
        return ['issued_at' => 'datetime', 'expires_at' => 'datetime', 'revoked_at' => 'datetime'];
    }

    /**
     * @return BelongsTo<Member, $this>
     */
    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function issuedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'issued_by');
    }

    /**
     * @return HasMany<AttendanceRecord, $this>
     */
    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(AttendanceRecord::class, 'qr_credential_id');
    }
}
