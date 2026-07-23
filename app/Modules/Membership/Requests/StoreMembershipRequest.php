<?php

namespace App\Modules\Membership\Requests;

use App\Modules\Membership\Models\Membership;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMembershipRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('sell', Membership::class);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $tenantId = $this->user()->tenant_id;

        return [
            'member_id' => [
                'required',
                Rule::exists('members', 'id')->where('tenant_id', $tenantId),
            ],
            'plan_id' => [
                'required',
                Rule::exists('plans', 'id')->where('tenant_id', $tenantId),
            ],
            'branch_id' => [
                'nullable',
                Rule::exists('branches', 'id')->where('tenant_id', $tenantId),
            ],
            'starts_on' => ['nullable', 'date'],
            'initial_payment' => ['nullable', 'numeric', 'min:0'],
            'payment_method' => ['nullable', Rule::in(['cash', 'card', 'bank_transfer', 'online'])],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
