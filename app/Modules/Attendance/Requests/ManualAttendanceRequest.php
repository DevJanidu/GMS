<?php

namespace App\Modules\Attendance\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ManualAttendanceRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if (! $this->filled('request_id') && $this->header('Idempotency-Key')) {
            $this->merge(['request_id' => $this->header('Idempotency-Key')]);
        }
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'member_id' => ['required', 'integer', 'min:1'],
            'request_id' => ['required', 'uuid'],
            'device_id' => ['nullable', 'string', 'max:128'],
            'override' => ['sometimes', 'boolean'],
            'override_reason' => ['required_if:override,true', 'nullable', 'string', 'min:3', 'max:500'],
        ];
    }
}
