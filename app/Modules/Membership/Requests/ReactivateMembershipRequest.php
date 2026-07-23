<?php

namespace App\Modules\Membership\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReactivateMembershipRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('reactivate', $this->route('membership'));
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [];
    }
}
