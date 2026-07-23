<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Database\Factories\BranchFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['tenant_id', 'name', 'code', 'address', 'phone', 'email', 'status'])]
class Branch extends Model
{
    /** @use HasFactory<BranchFactory> */
    use BelongsToTenant, HasFactory;

    /**
     * @return BelongsToMany<User, $this>
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_branch')
            ->withPivot('is_primary')
            ->withTimestamps();
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }
}
