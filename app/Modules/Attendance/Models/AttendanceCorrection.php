<?php

namespace App\Modules\Attendance\Models;

use App\Models\Concerns\BelongsToTenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use LogicException;

class AttendanceCorrection extends Model
{
    use BelongsToTenant;

    public $timestamps = false;

    protected $fillable = [
        'tenant_id', 'attendance_record_id', 'request_id', 'request_hash', 'correction_type', 'before_values',
        'after_values', 'reason', 'corrected_by', 'corrected_at',
    ];

    protected function casts(): array
    {
        return ['before_values' => 'array', 'after_values' => 'array', 'corrected_at' => 'datetime'];
    }

    protected static function booted(): void
    {
        static::updating(fn () => throw new LogicException('Attendance corrections are append-only.'));
        static::deleting(fn () => throw new LogicException('Attendance corrections are append-only.'));
    }

    /**
     * @return BelongsTo<AttendanceRecord, $this>
     */
    public function attendanceRecord(): BelongsTo
    {
        return $this->belongsTo(AttendanceRecord::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function correctedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'corrected_by');
    }
}
