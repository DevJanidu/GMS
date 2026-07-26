<?php

namespace App\Modules\Billing\Requests;

use App\Modules\Billing\Enums\DiscountType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'branch_id' => ['required', 'integer', 'exists:branches,id'],
            'member_id' => ['nullable', 'integer', 'exists:members,id'],
            'membership_id' => ['nullable', 'integer', 'min:1'],
            'currency' => ['required', 'string', 'size:3'],
            'issued_on' => ['nullable', 'date'],
            'due_on' => ['nullable', 'date', 'after_or_equal:issued_on'],
            'discount_type' => ['nullable', Rule::enum(DiscountType::class)],
            'discount_value' => ['nullable', 'integer', 'min:0'],
            'tax_rate_basis_points' => ['nullable', 'integer', 'between:0,10000'],
            'joining_fee_cents' => ['nullable', 'integer', 'min:0'],
            'notes' => ['nullable', 'string', 'max:5000'],
            'idempotency_key' => ['nullable', 'string', 'max:128'],
            'items' => ['required', 'array', 'min:1', 'max:100'],
            'items.*.description' => ['required', 'string', 'max:255'],
            'items.*.item_type' => ['nullable', 'string', 'max:32'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:100000'],
            'items.*.unit_price_cents' => ['required', 'integer', 'min:0'],
            'items.*.metadata' => ['nullable', 'array'],
        ];
    }

    /**
     * @return array{
     *   branch_id:int,member_id:int|null,membership_id:int|null,currency:string,
     *   issued_on:string,due_on:string|null,discount_type:string|null,discount_value:int,
     *   tax_rate_basis_points:int,joining_fee_cents:int,notes:string|null,
     *   idempotency_key:string|null,
     *   items:list<array{description:string,item_type:string,quantity:int,unit_price_cents:int,metadata:array<string,mixed>|null}>
     * }
     */
    public function invoiceData(): array
    {
        $items = [];
        foreach ($this->array('items') as $item) {
            if (! is_array($item)) {
                continue;
            }
            $items[] = [
                'description' => (string) ($item['description'] ?? ''),
                'item_type' => (string) ($item['item_type'] ?? 'other'),
                'quantity' => (int) ($item['quantity'] ?? 0),
                'unit_price_cents' => (int) ($item['unit_price_cents'] ?? 0),
                'metadata' => isset($item['metadata']) && is_array($item['metadata']) ? $item['metadata'] : null,
            ];
        }

        return [
            'branch_id' => $this->integer('branch_id'),
            'member_id' => $this->filled('member_id') ? $this->integer('member_id') : null,
            'membership_id' => $this->filled('membership_id') ? $this->integer('membership_id') : null,
            'currency' => $this->string('currency')->toString(),
            'issued_on' => $this->date('issued_on')?->toDateString() ?? now()->toDateString(),
            'due_on' => $this->date('due_on')?->toDateString(),
            'discount_type' => $this->filled('discount_type') ? $this->string('discount_type')->toString() : null,
            'discount_value' => $this->integer('discount_value'),
            'tax_rate_basis_points' => $this->integer('tax_rate_basis_points'),
            'joining_fee_cents' => $this->integer('joining_fee_cents'),
            'notes' => $this->filled('notes') ? $this->string('notes')->toString() : null,
            'idempotency_key' => $this->filled('idempotency_key') ? $this->string('idempotency_key')->toString() : null,
            'items' => $items,
        ];
    }
}
