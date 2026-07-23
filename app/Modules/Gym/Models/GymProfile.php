<?php

namespace App\Modules\Gym\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'tenant_id', 'legal_name', 'logo_path', 'address', 'city', 'country',
    'contact_email', 'contact_phone', 'tax_id', 'website', 'description',
])]
class GymProfile extends Model
{
    use BelongsToTenant;
}
