<?php

namespace App\Modules\Membership\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FreezeMembershipRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('freeze', $this->route('membership'));
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'resumes_on' => ['nullable', 'date', 'after:today'],
            'reason' => ['nullable', 'string', 'max:500'],
        ];
    }
}
