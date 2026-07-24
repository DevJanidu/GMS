<?php

namespace App\Modules\Attendance\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ScanAttendanceRequest extends FormRequest
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
            'qr_token' => ['required', 'string', 'max:512'],
            'request_id' => ['required', 'uuid'],
            'source' => ['sometimes', Rule::in(['phone_camera'])],
            'device_id' => ['nullable', 'string', 'max:128'],
            'action' => ['sometimes', Rule::in(['auto', 'check_in', 'check_out'])],
            'override' => ['sometimes', 'boolean'],
            'override_reason' => ['required_if:override,true', 'nullable', 'string', 'min:3', 'max:500'],
        ];
    }
}
