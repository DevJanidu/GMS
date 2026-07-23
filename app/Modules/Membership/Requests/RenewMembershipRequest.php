<?php

namespace App\Modules\Membership\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RenewMembershipRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('renew', $this->route('membership'));
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'plan_id' => [
                'required',
                Rule::exists('plans', 'id')->where('tenant_id', $this->user()->tenant_id),
            ],
            'initial_payment' => ['nullable', 'numeric', 'min:0'],
            'payment_method' => ['nullable', Rule::in(['cash', 'card', 'bank_transfer', 'online'])],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
