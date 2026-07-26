<?php

namespace App\Modules\Notification\Requests;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreNotificationTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        $template = $this->route('notification_template') ?? $this->route('notificationTemplate');
        $templateId = $template instanceof Model ? $template->getKey() : $template;
        $tenantId = $this->user()?->tenant_id;
        $channel = (string) $this->input('channel');
        $locale = (string) $this->input('locale', 'en');

        return [
            'branch_id' => ['nullable', 'integer'],
            'name' => ['required', 'string', 'max:120'],
            'key' => [
                'required', 'alpha_dash', 'max:120',
                Rule::unique('notification_templates', 'key')
                    ->where('tenant_id', $tenantId)
                    ->where('channel', $channel)
                    ->where('locale', $locale)
                    ->ignore($templateId),
            ],
            'channel' => ['required', Rule::in(['in_app', 'email', 'sms', 'whatsapp'])],
            'locale' => ['nullable', 'string', 'max:10'],
            'subject' => [Rule::requiredIf($channel === 'email'), 'nullable', 'string', 'max:200'],
            'body' => ['required', 'string', 'max:20000'],
            'variables' => ['nullable', 'array', 'max:30'],
            'variables.*' => ['string', 'regex:/^[a-zA-Z0-9_.-]+$/', 'max:80'],
            'status' => ['nullable', Rule::in(['active', 'inactive'])],
        ];
    }

    /** @return array<int, callable(Validator): void> */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $allowed = array_map('strval', (array) $this->input('variables', []));
                $content = (string) $this->input('subject').' '.(string) $this->input('body');
                preg_match_all('/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/', $content, $matches);
                $unknown = array_values(array_diff(array_unique($matches[1]), $allowed));

                if ($unknown !== []) {
                    $validator->errors()->add(
                        'variables',
                        'Declare every template placeholder in variables: '.implode(', ', $unknown).'.',
                    );
                }
            },
        ];
    }
}
