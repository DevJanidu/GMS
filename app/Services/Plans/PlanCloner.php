<?php

namespace App\Services\Plans;

use App\Enums\PlanStatus;
use App\Models\Plan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Duplicates a plan (and its branch availability) as a new, inactive draft
 * so staff can adjust pricing or rules without touching the live plan.
 */
class PlanCloner
{
    public function clone(Plan $plan): Plan
    {
        return DB::transaction(function () use ($plan) {
            $copy = $plan->replicate(['slug', 'cloned_from_id']);
            $copy->name = "{$plan->name} (Copy)";
            $copy->slug = Str::slug($copy->name).'-'.Str::lower(Str::random(6));
            $copy->status = PlanStatus::Inactive;
            $copy->cloned_from_id = $plan->id;
            $copy->save();

            if (! $plan->available_at_all_branches) {
                $copy->branches()->sync($plan->branches()->pluck('branches.id'));
            }

            return $copy;
        });
    }
}
