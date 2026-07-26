<?php

namespace App\Services\Members;

use App\Models\Tenant;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Issues gap-free, tenant-scoped member numbers backed by a row-locked
 * counter in `member_sequences` so concurrent registrations never collide.
 */
class MemberNumberGenerator
{
    public function next(Tenant $tenant): string
    {
        return DB::transaction(function () use ($tenant) {
            $this->ensureSequenceRowExists($tenant);

            $nextNumber = DB::table('member_sequences')
                ->where('tenant_id', $tenant->id)
                ->lockForUpdate()
                ->value('last_number') + 1;

            DB::table('member_sequences')
                ->where('tenant_id', $tenant->id)
                ->update(['last_number' => $nextNumber, 'updated_at' => now()]);

            return $this->format($tenant, $nextNumber);
        });
    }

    protected function ensureSequenceRowExists(Tenant $tenant): void
    {
        $exists = DB::table('member_sequences')->where('tenant_id', $tenant->id)->exists();

        if ($exists) {
            return;
        }

        try {
            DB::table('member_sequences')->insert([
                'tenant_id' => $tenant->id,
                'last_number' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } catch (QueryException) {
            // A concurrent request already created the row; the lockForUpdate
            // read above will see it.
        }
    }

    protected function format(Tenant $tenant, int $number): string
    {
        $prefix = Str::of($tenant->slug)
            ->replaceMatches('/[^A-Za-z]/', '')
            ->upper()
            ->substr(0, 4)
            ->toString();

        return sprintf('%s-%05d', $prefix ?: 'MEM', $number);
    }
}
