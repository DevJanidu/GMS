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

export function SplitPaymentForm({
    invoiceId,
    balanceCents,
    onSaved,
}: {
    invoiceId: number;
    balanceCents: number;
    onSaved: () => void;
}) {
    const [first, setFirst] = useState('');
    const [second, setSecond] = useState('');
    const [firstMethod, setFirstMethod] = useState<PaymentMethod>('cash');
    const [secondMethod, setSecondMethod] = useState<PaymentMethod>('card');
    const [error, setError] = useState('');

    async function submit(event: React.FormEvent) {
        event.preventDefault();
        const amounts = [first, second].map((value) =>
            Math.round(Number(value) * 100),
        );

        if (amounts[0] + amounts[1] > balanceCents) {
            setError('Split total cannot exceed the outstanding balance.');

            return;
        }

        try {
            await billingApi.splitPayment(invoiceId, {
                idempotency_key: crypto.randomUUID(),
                payments: [
                    { amount_cents: amounts[0], method: firstMethod },
                    { amount_cents: amounts[1], method: secondMethod },
                ],
            });
            onSaved();
        } catch (reason) {
            setError(
                reason instanceof Error
                    ? reason.message
                    : 'Unable to record split payment.',
            );
        }
    }

    return (
        <form onSubmit={submit} className="mt-6 space-y-3 border-t pt-5">
            <h3 className="font-medium">Split payment</h3>
            {[
                {
                    label: 'First part',
                    amount: first,
                    setAmount: setFirst,
                    method: firstMethod,
                    setMethod: setFirstMethod,
                },
                {
                    label: 'Second part',
                    amount: second,
                    setAmount: setSecond,
                    method: secondMethod,
                    setMethod: setSecondMethod,
                },
            ].map((part) => (
                <div
                    className="grid grid-cols-[1fr_1fr] gap-2"
                    key={part.label}
                >
                    <div>
                        <Label className="sr-only">{part.label}</Label>
                        <Input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={part.amount}
                            onChange={(event) =>
                                part.setAmount(event.target.value)
                            }
                            placeholder={part.label}
                            required
                        />
                    </div>
                    <Select
                        value={part.method}
                        onValueChange={(value) =>
                            part.setMethod(value as PaymentMethod)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="card">Card</SelectItem>
                            <SelectItem value="bank_transfer">Bank</SelectItem>
                            <SelectItem value="online">Online</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            ))}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" variant="outline" className="w-full">
                Record split payment
            </Button>
        </form>
    );
}
