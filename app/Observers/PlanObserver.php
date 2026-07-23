<?php

namespace App\Observers;

use App\Models\Plan;
use App\Models\PlanPriceHistory;
use Illuminate\Support\Facades\Auth;

/**
 * Keeps `plan_price_history` an accurate ledger of every price a plan has
 * ever had, so a price change never rewrites what a plan cost in the past.
 */
class PlanObserver
{
    public function saved(Plan $plan): void
    {
        if ($plan->wasRecentlyCreated) {
            PlanPriceHistory::create([
                'plan_id' => $plan->id,
                'price' => $plan->price,
                'joining_fee' => $plan->joining_fee,
                'effective_from' => $plan->created_at,
                'changed_by' => Auth::id(),
            ]);

            return;
        }

        if (! $plan->wasChanged(['price', 'joining_fee'])) {
            return;
        }

        PlanPriceHistory::query()
            ->where('plan_id', $plan->id)
            ->whereNull('effective_until')
            ->update(['effective_until' => now()]);

        PlanPriceHistory::create([
            'plan_id' => $plan->id,
            'price' => $plan->price,
            'joining_fee' => $plan->joining_fee,
            'effective_from' => now(),
            'changed_by' => Auth::id(),
        ]);
    }
}
