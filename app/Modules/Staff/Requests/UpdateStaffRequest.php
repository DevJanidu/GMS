<?php

namespace App\Modules\Staff\Requests;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStaffRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User $staff */
        $staff = $this->route('staff');

        return $this->user()->can('update', $staff);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'job_title' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'role_id' => [
                'sometimes', 'required', 'integer',
                Rule::exists(Role::class, 'id')->where(fn ($query) => $query
                    ->where(fn ($query) => $query
                        ->whereNull('tenant_id')
                        ->orWhere('tenant_id', $this->user()->tenant_id)
                    )
                ),
            ],
        ];
    }
}
