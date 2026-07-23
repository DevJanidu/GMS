<?php

namespace App\Modules\Membership\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CancelMembershipRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('cancel', $this->route('membership'));
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'reason' => ['required', 'string', 'max:500'],
        ];
    }
}
