<?php

namespace App\Modules\Branch\Requests;

use App\Models\Branch;
use Illuminate\Foundation\Http\FormRequest;

class UpdateOpeningHoursRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Branch $branch */
        $branch = $this->route('branch');

        return $this->user()->can('update', $branch);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

        return [
            'opening_hours' => ['required', 'array'],
            ...collect($days)->mapWithKeys(fn (string $day) => [
                "opening_hours.{$day}" => ['sometimes', 'array'],
                "opening_hours.{$day}.closed" => ['sometimes', 'boolean'],
                "opening_hours.{$day}.open" => ['required_if:opening_hours.'.$day.'.closed,false', 'nullable', 'date_format:H:i'],
                "opening_hours.{$day}.close" => ['required_if:opening_hours.'.$day.'.closed,false', 'nullable', 'date_format:H:i'],
            ])->all(),
        ];
    }
}
