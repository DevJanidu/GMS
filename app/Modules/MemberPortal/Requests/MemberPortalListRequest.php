<?php

namespace App\Modules\MemberPortal\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MemberPortalListRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->attributes->has('memberPortalAccount');
    }

    /** @return array<string, list<string>> */
    public function rules(): array
    {
        return [
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
        ];
    }

    public function perPage(): int
    {
        return $this->integer('per_page', 20);
    }
}
