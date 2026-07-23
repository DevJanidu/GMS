<?php

namespace App\Modules\Staff\Requests;

use App\Models\Branch;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InviteStaffRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', User::class);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'job_title' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'role_id' => [
                'required', 'integer',
                Rule::exists(Role::class, 'id')->where(fn ($query) => $query
                    ->where(fn ($query) => $query
                        ->whereNull('tenant_id')
                        ->orWhere('tenant_id', $this->user()->tenant_id)
                    )
                ),
            ],
            'branch_ids' => ['sometimes', 'array'],
            'branch_ids.*' => [
                'integer',
                Rule::exists(Branch::class, 'id')->where('tenant_id', $this->user()->tenant_id),
            ],
            'primary_branch_id' => ['nullable', 'integer', 'in_array:branch_ids.*'],
        ];
    }
}
