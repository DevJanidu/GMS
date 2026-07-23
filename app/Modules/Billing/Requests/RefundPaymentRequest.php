<?php

namespace App\Modules\Billing\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RefundPaymentRequest extends FormRequest
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
            'amount_cents' => ['required', 'integer', 'min:1'],
            'reason' => ['required', 'string', 'min:3', 'max:1000'],
            'idempotency_key' => ['required', 'string', 'max:128'],
            'metadata' => ['nullable', 'array'],
        ];
    }

    /** @return array{amount_cents:int,reason:string,idempotency_key:string,metadata:array<string,mixed>|null} */
    public function refundData(): array
    {
        return [
            'amount_cents' => $this->integer('amount_cents'),
            'reason' => $this->string('reason')->toString(),
            'idempotency_key' => $this->string('idempotency_key')->toString(),
            'metadata' => $this->has('metadata') ? $this->array('metadata') : null,
        ];
    }
}
