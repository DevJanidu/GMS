<?php

namespace App\Http\Controllers;

use App\Enums\PlanStatus;
use App\Models\Plan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PlanStatusController extends Controller
{
    public function update(Request $request, Plan $plan): RedirectResponse
    {
        $this->authorize('update', $plan);

        $data = $request->validate([
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ]);

        $plan->status = PlanStatus::from($data['status']);
        $plan->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => "Plan marked as {$plan->status->label()}."]);

        return back();
    }
}
