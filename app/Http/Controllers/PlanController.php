<?php

namespace App\Http\Controllers;

use App\Http\Requests\Plans\StorePlanRequest;
use App\Http\Requests\Plans\UpdatePlanRequest;
use App\Http\Resources\PlanResource;
use App\Models\Branch;
use App\Models\Plan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PlanController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Plan::class);

        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();

        $plans = Plan::query()
            ->withCount('branches')
            ->when($search !== '', fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('plans/index', [
            'plans' => PlanResource::collection($plans),
            'filters' => [
                'search' => $search ?: null,
                'status' => $status ?: null,
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Plan::class);

        return Inertia::render('plans/create', [
            'branches' => Branch::query()->where('status', 'active')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StorePlanRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $plan = new Plan(collect($data)->except(['branch_ids'])->all());
        $plan->slug = Str::slug($data['name']).'-'.Str::lower(Str::random(6));
        $plan->created_by = $request->user()->id;
        $plan->save();

        if (! $plan->available_at_all_branches) {
            $plan->branches()->sync($data['branch_ids'] ?? []);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => "Plan {$plan->name} created."]);

        return to_route('plans.show', $plan);
    }

    public function show(Plan $plan): Response
    {
        $this->authorize('view', $plan);

        $plan->load(['branches', 'priceHistory', 'clonedFrom']);

        return Inertia::render('plans/show', [
            'plan' => (new PlanResource($plan))->resolve(),
        ]);
    }

    public function edit(Plan $plan): Response
    {
        $this->authorize('update', $plan);

        $plan->load('branches');

        return Inertia::render('plans/edit', [
            'plan' => (new PlanResource($plan))->resolve(),
            'branches' => Branch::query()->where('status', 'active')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdatePlanRequest $request, Plan $plan): RedirectResponse
    {
        $data = $request->validated();

        $plan->fill(collect($data)->except(['branch_ids'])->all());
        $plan->save();

        $plan->branches()->sync($plan->available_at_all_branches ? [] : ($data['branch_ids'] ?? []));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Plan updated.']);

        return to_route('plans.show', $plan);
    }
}
