<?php

namespace App\Http\Requests\Plans;

use App\Models\Plan;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Plan::class);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:2000'],
            'price' => ['required', 'numeric', 'min:0'],
            'joining_fee' => ['nullable', 'numeric', 'min:0'],
            'duration_value' => ['required', 'integer', 'min:1'],
            'duration_unit' => ['required', Rule::in(['days', 'weeks', 'months', 'years'])],
            'access_rules' => ['nullable', 'array'],
            'access_rules.guest_passes_per_month' => ['nullable', 'integer', 'min:0'],
            'access_rules.freeze_days_allowed' => ['nullable', 'integer', 'min:0'],
            'access_rules.classes_included' => ['nullable', 'boolean'],
            'available_at_all_branches' => ['required', 'boolean'],
            'branch_ids' => ['required_if:available_at_all_branches,false', 'array'],
            'branch_ids.*' => ['integer', 'exists:branches,id'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ];
    }
}
