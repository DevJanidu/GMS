<?php

namespace App\Modules\Report\Requests;

use App\Enums\MemberStatus;
use App\Modules\Billing\Enums\PaymentMethod;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\Validator;

class ReportFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
            'branch_id' => ['nullable', 'integer'],
            'plan_id' => ['nullable', 'integer'],
            'member_status' => ['nullable', new Enum(MemberStatus::class)],
            'payment_method' => ['nullable', new Enum(PaymentMethod::class)],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }

    protected function passedValidation(): void
    {
        $from = CarbonImmutable::parse($this->validated('date_from') ?? now()->subDays(30));
        $to = CarbonImmutable::parse($this->validated('date_to') ?? now());
        if ($from->diffInDays($to) > 366) {
            abort(422, 'The report date range cannot exceed 366 days.');
        }
    }

    /** @return array<int, callable(Validator): void> */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $supported = match ((string) $this->route('reportKey')) {
                    'membership-summary' => ['plan_id', 'member_status'],
                    'membership-sales', 'renewals', 'expiries' => ['plan_id'],
                    'sales', 'collections', 'refunds' => ['payment_method'],
                    default => [],
                };

                foreach (['plan_id', 'member_status', 'payment_method'] as $filter) {
                    if ($this->filled($filter) && ! in_array($filter, $supported, true)) {
                        $validator->errors()->add($filter, 'This filter is not supported by the selected report.');
                    }
                }
            },
        ];
    }
}
