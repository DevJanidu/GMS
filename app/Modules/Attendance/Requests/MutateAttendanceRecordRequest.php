<?php

namespace App\Modules\Attendance\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MutateAttendanceRecordRequest extends FormRequest
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
            'request_id' => ['required', 'uuid'],
            'reason' => ['required', 'string', 'min:3', 'max:500'],
            'checked_in_at' => ['sometimes', 'date'],
            'checked_out_at' => ['sometimes', 'nullable', 'date'],
        ];
    }
}
