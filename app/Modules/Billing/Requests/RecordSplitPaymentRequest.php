<?php

namespace App\Modules\Billing\Requests;

use App\Modules\Billing\Enums\PaymentMethod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RecordSplitPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (! $this->filled('idempotency_key') && $this->header('Idempotency-Key')) {
            $this->merge(['idempotency_key' => $this->header('Idempotency-Key')]);
        }
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'idempotency_key' => ['required', 'string', 'max:110'],
            'payments' => ['required', 'array', 'min:2', 'max:10'],
            'payments.*.amount_cents' => ['required', 'integer', 'min:1'],
            'payments.*.method' => ['required', Rule::enum(PaymentMethod::class)],
            'payments.*.reference' => ['nullable', 'string', 'max:255'],
            'payments.*.metadata' => ['nullable', 'array'],
        ];
    }

    /**
     * @return array{idempotency_key:string,payments:list<array{amount_cents:int,method:string,reference:string|null,metadata:array<string,mixed>|null}>}
     */
    public function splitData(): array
    {
        $payments = [];
        foreach ($this->array('payments') as $payment) {
            if (! is_array($payment)) {
                continue;
            }
            $payments[] = [
                'amount_cents' => (int) ($payment['amount_cents'] ?? 0),
                'method' => (string) ($payment['method'] ?? ''),
                'reference' => isset($payment['reference']) ? (string) $payment['reference'] : null,
                'metadata' => isset($payment['metadata']) && is_array($payment['metadata']) ? $payment['metadata'] : null,
            ];
        }

        return [
            'idempotency_key' => $this->string('idempotency_key')->toString(),
            'payments' => $payments,
        ];
    }
}
