<?php

namespace App\Modules\Billing\Services;

use App\Modules\Billing\Models\BillingSequence as BillingSequenceModel;
use App\Tenancy\Services\TenantContext;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class BillingSequence
{
    public function next(string $type, string $prefix): string
    {
        $tenantId = app(TenantContext::class)->id();
        throw_if(! $tenantId, RuntimeException::class, 'Tenant context is required.');

        return DB::transaction(function () use ($tenantId, $type, $prefix): string {
            BillingSequenceModel::query()->insertOrIgnore([
                'tenant_id' => $tenantId,
                'type' => $type,
                'next_value' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $sequence = BillingSequenceModel::query()
                ->where('tenant_id', $tenantId)
                ->where('type', $type)
                ->lockForUpdate()
                ->firstOrFail();
            $value = $sequence->next_value;
            $sequence->increment('next_value');

            return sprintf('%s-%s-%06d', $prefix, now()->format('Y'), $value);
        });
    }
}
