<?php

namespace App\Modules\Attendance\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RotateQrCredentialRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return ['member_id' => ['required', 'integer', 'min:1']];
    }
}
