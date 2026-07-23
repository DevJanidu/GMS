<?php

namespace App\Modules\Billing\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $tenant_id
 * @property string $type
 * @property int $next_value
 */
#[Fillable(['tenant_id', 'type', 'next_value'])]
class BillingSequence extends Model {}
