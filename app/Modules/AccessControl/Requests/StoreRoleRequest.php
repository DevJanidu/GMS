<?php

namespace App\Modules\AccessControl\Requests;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Role::class);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable', 'string', 'max:255',
                Rule::unique('roles', 'slug')->where('tenant_id', $this->user()->tenant_id),
            ],
            'permissions' => ['sometimes', 'array'],
            'permissions.*' => ['integer', Rule::exists(Permission::class, 'id')],
        ];
    }
}
