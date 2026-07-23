<?php

namespace App\Modules\Membership\Requests;

use App\Modules\Membership\Models\Membership;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BulkReminderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('remind', Membership::class);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'membership_ids' => ['required', 'array', 'min:1'],
            'membership_ids.*' => [
                'integer',
                Rule::exists('memberships', 'id')->where('tenant_id', $this->user()->tenant_id),
            ],
        ];
    }
}
