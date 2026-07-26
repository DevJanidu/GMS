<?php

namespace App\Modules\Notification\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreNotificationRuleRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:120'],
            'event_type' => ['required', Rule::in([
                'MemberRegistered', 'MembershipActivated', 'MembershipExpiring',
                'MembershipExpired', 'MembershipRenewed', 'PaymentCompleted',
                'PaymentRefunded', 'AttendanceCheckedIn', 'AttendanceRejected',
            ])],
            'channel' => ['required', Rule::in(['in_app', 'email', 'sms', 'whatsapp'])],
            'status' => ['nullable', Rule::in(['active', 'inactive'])],
            'offset_minutes' => ['nullable', 'integer', 'min:0', 'max:525600'],
            'conditions' => ['nullable', 'array'],
            'conditions.member_status' => ['nullable', 'string', 'max:30'],
            'schedule' => ['nullable', 'array'],
        ];
    }
}
