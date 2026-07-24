<?php

namespace App\Modules\Attendance\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAttendanceSettingsRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'mode' => ['required', Rule::in(['check_in_only', 'check_in_out'])],
            'duplicate_window_seconds' => ['required', 'integer', 'min:5', 'max:3600'],
            'allow_manual_entry' => ['required', 'boolean'],
            'manager_override_required' => ['required', 'boolean'],
            'visit_limit_rules' => ['nullable', 'array'],
            'visit_limit_rules.visits_per_day' => ['nullable', 'integer', 'min:1', 'max:100'],
            'visit_limit_rules.visits_per_week' => ['nullable', 'integer', 'min:1', 'max:700'],
            'visit_limit_rules.visits_per_month' => ['nullable', 'integer', 'min:1', 'max:3100'],
        ];
    }
}
