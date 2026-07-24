<?php

namespace App\Modules\Notification\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAnnouncementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'branch_id' => ['nullable', 'integer'],
            'template_id' => ['required', 'integer'],
            'title' => ['required', 'string', 'max:200'],
            'message' => ['required', 'string', 'max:10000'],
            'channels' => ['required', 'array', 'min:1'],
            'channels.*' => [Rule::in(['in_app', 'email', 'sms', 'whatsapp'])],
            'audience_filters' => ['nullable', 'array'],
            'audience_filters.member_status' => ['nullable', Rule::in(['active', 'inactive', 'archived'])],
            'audience_filters.plan_id' => ['nullable', 'integer'],
            'audience_filters.branch_id' => ['nullable', 'integer'],
            'scheduled_at' => ['nullable', 'date', 'after_or_equal:now'],
        ];
    }
}
