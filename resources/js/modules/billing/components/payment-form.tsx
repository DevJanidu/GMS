import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { billingApi } from '../api/billing';
import type { PaymentMethod } from '../types';

export function PaymentForm({
    invoiceId,
    balanceCents,
    onSaved,
}: {
    invoiceId: number;
    balanceCents: number;
    onSaved: () => void;
}) {
    const [amount, setAmount] = useState((balanceCents / 100).toFixed(2));
    const [method, setMethod] = useState<PaymentMethod>('cash');
    const [reference, setReference] = useState('');
    const [installment, setInstallment] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    async function submit(event: React.FormEvent) {
        event.preventDefault();
        setSaving(true);
        setError('');

        try {
            await billingApi.recordPayment(invoiceId, {
                amount_cents: Math.round(Number(amount) * 100),
                method,
                reference: reference || undefined,
                installment_number: installment
                    ? Number(installment)
                    : undefined,
                idempotency_key: crypto.randomUUID(),
            });
            onSaved();
        } catch (reason) {
            setError(
                reason instanceof Error ? reason.message : 'Payment failed.',
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="payment-amount">Amount</Label>
                <Input
                    id="payment-amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    max={balanceCents / 100}
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label>Method</Label>
                <Select
                    value={method}
                    onValueChange={(value) => setMethod(value as PaymentMethod)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="bank_transfer">
                            Bank transfer
                        </SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="payment-reference">Reference</Label>
                <Input
                    id="payment-reference"
                    value={reference}
                    onChange={(event) => setReference(event.target.value)}
                    placeholder="Optional transaction reference"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="installment-number">Installment</Label>
                <Input
                    id="installment-number"
                    type="number"
                    min="1"
                    value={installment}
                    onChange={(event) => setInstallment(event.target.value)}
                    placeholder="Optional installment number"
                />
            </div>
            {error && (
                <p className="text-sm text-destructive sm:col-span-2">
                    {error}
                </p>
            )}
            <Button disabled={saving} className="sm:col-span-2">
                {saving ? 'Recording…' : 'Record payment'}
            </Button>
        </form>
    );
}
