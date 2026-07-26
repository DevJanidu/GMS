<?php

namespace App\Modules\Billing\Requests;

use App\Modules\Billing\Enums\PaymentMethod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RecordPaymentRequest extends FormRequest
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
            'method' => ['required', Rule::enum(PaymentMethod::class)],
            'reference' => ['nullable', 'string', 'max:255'],
            'idempotency_key' => ['required', 'string', 'max:128'],
            'paid_at' => ['nullable', 'date', 'before_or_equal:now'],
            'metadata' => ['nullable', 'array'],
            'installment_number' => ['nullable', 'integer', 'min:1'],
        ];
    }

    /**
     * @return array{amount_cents:int,method:string,reference:string|null,idempotency_key:string,paid_at:string|null,metadata:array<string,mixed>|null,installment_number:int|null}
     */
    public function paymentData(): array
    {
        return [
            'amount_cents' => $this->integer('amount_cents'),
            'method' => $this->string('method')->toString(),
            'reference' => $this->filled('reference') ? $this->string('reference')->toString() : null,
            'idempotency_key' => $this->string('idempotency_key')->toString(),
            'paid_at' => $this->date('paid_at')?->toIso8601String(),
            'metadata' => $this->has('metadata') ? $this->array('metadata') : null,
            'installment_number' => $this->filled('installment_number') ? $this->integer('installment_number') : null,
        ];
    }
}
