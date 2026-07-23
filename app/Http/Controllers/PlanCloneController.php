<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Services\Plans\PlanCloner;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class PlanCloneController extends Controller
{
    public function store(Plan $plan, PlanCloner $cloner): RedirectResponse
    {
        $this->authorize('create', Plan::class);
        $this->authorize('view', $plan);

        $copy = $cloner->clone($plan);

        Inertia::flash('toast', ['type' => 'success', 'message' => "Cloned as {$copy->name}."]);

        return to_route('plans.edit', $copy);
    }
}
