<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Database\Factories\MemberDocumentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property int $tenant_id
 * @property int $member_id
 * @property string $name
 * @property string $file_path
 * @property string|null $mime_type
 * @property int|null $size
 * @property int|null $uploaded_by
 */
#[Fillable(['tenant_id', 'member_id', 'name', 'file_path', 'mime_type', 'size', 'uploaded_by'])]
class MemberDocument extends Model
{
    /** @use HasFactory<MemberDocumentFactory> */
    use BelongsToTenant, HasFactory;

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
    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function url(): string
    {
        return Storage::disk('public')->url($this->file_path);
    }
}
