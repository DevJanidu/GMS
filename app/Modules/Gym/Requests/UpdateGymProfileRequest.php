<?php

namespace App\Modules\Gym\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGymProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('gym.update');
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'legal_name' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'city' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
            'tax_id' => ['nullable', 'string', 'max:100'],
            'website' => ['nullable', 'url', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'logo' => ['nullable', 'image', 'max:4096'],
            'currency' => ['nullable', 'string', 'regex:/^[A-Z]{3}$/'],
        ];
    }
}
