<?php

namespace App\Modules\Staff\Requests;

use App\Models\Branch;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AssignBranchesRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User $staff */
        $staff = $this->route('staff');

        return $this->user()->can('assignBranches', $staff);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'branch_ids' => ['required', 'array'],
            'branch_ids.*' => [
                'integer',
                Rule::exists(Branch::class, 'id')->where('tenant_id', $this->user()->tenant_id),
            ],
            'primary_branch_id' => ['nullable', 'integer', 'in_array:branch_ids.*'],
        ];
    }
}
