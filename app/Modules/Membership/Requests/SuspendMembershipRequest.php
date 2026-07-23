<?php

namespace App\Modules\Membership\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SuspendMembershipRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('suspend', $this->route('membership'));
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
