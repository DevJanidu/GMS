import { Head } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { billingApi } from '../api/billing';
import { Money } from '../components/money';

type DraftItem = { description: string; quantity: number; price: string };

export default function CreateInvoicePage({ branchId }: { branchId: number }) {
    const [memberId, setMemberId] = useState('');
    const [items, setItems] = useState<DraftItem[]>([
        { description: 'Membership fee', quantity: 1, price: '' },
    ]);
    const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>(
        'fixed',
    );
    const [discount, setDiscount] = useState('0');
    const [tax, setTax] = useState('0');
    const [joiningFee, setJoiningFee] = useState('0');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const subtotal = useMemo(
        () =>
            items.reduce(
                (sum, item) =>
                    sum +
                    Math.round(Number(item.price || 0) * 100) * item.quantity,
                0,
            ),
        [items],
    );

    async function submit(event: React.FormEvent) {
        event.preventDefault();
        setSaving(true);
        setError('');

        try {
            const response = await billingApi.createInvoice({
                branch_id: branchId,
                member_id: memberId ? Number(memberId) : undefined,
                currency: 'LKR',
                discount_type: Number(discount) ? discountType : undefined,
                discount_value:
                    discountType === 'percentage'
                        ? Math.round(Number(discount) * 100)
                        : Math.round(Number(discount) * 100),
                tax_rate_basis_points: Math.round(Number(tax) * 100),
                joining_fee_cents: Math.round(Number(joiningFee) * 100),
                notes: notes || undefined,
                idempotency_key: crypto.randomUUID(),
                items: items.map((item) => ({
                    description: item.description,
                    quantity: item.quantity,
                    unit_price_cents: Math.round(Number(item.price) * 100),
                })),
            });
            window.location.assign(`/billing/invoices/${response.data.id}`);
        } catch (reason) {
            setError(
                reason instanceof Error
                    ? reason.message
                    : 'Unable to create invoice.',
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <Head title="Create invoice" />
            <main className="mx-auto w-full max-w-4xl p-4 sm:p-6">
                <h1 className="text-2xl font-semibold">Create invoice</h1>
                <p className="mb-6 text-sm text-muted-foreground">
                    Amounts are calculated and snapshotted by the server.
                </p>
                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="member-id">Member ID</Label>
                        <Input
                            id="member-id"
                            type="number"
                            min="1"
                            value={memberId}
                            onChange={(event) =>
                                setMemberId(event.target.value)
                            }
                            placeholder="Optional for walk-in invoices"
                        />
                    </div>
                    <section className="space-y-3 rounded-xl border p-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold">Items</h2>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setItems([
                                        ...items,
                                        {
                                            description: '',
                                            quantity: 1,
                                            price: '',
                                        },
                                    ])
                                }
                            >
                                <Plus /> Add item
                            </Button>
                        </div>
                        {items.map((item, index) => (
                            <div
                                className="grid gap-3 sm:grid-cols-[1fr_7rem_9rem_auto]"
                                key={index}
                            >
                                <Input
                                    aria-label={`Item ${index + 1} description`}
                                    value={item.description}
                                    onChange={(event) =>
                                        setItems(
                                            items.map((current, position) =>
                                                position === index
                                                    ? {
                                                          ...current,
                                                          description:
                                                              event.target
                                                                  .value,
                                                      }
                                                    : current,
                                            ),
                                        )
                                    }
                                    placeholder="Description"
                                    required
                                />
                                <Input
                                    aria-label={`Item ${index + 1} quantity`}
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(event) =>
                                        setItems(
                                            items.map((current, position) =>
                                                position === index
                                                    ? {
                                                          ...current,
                                                          quantity: Number(
                                                              event.target
                                                                  .value,
                                                          ),
                                                      }
                                                    : current,
                                            ),
                                        )
                                    }
                                    required
                                />
                                <Input
                                    aria-label={`Item ${index + 1} price`}
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={item.price}
                                    onChange={(event) =>
                                        setItems(
                                            items.map((current, position) =>
                                                position === index
                                                    ? {
                                                          ...current,
                                                          price: event.target
                                                              .value,
                                                      }
                                                    : current,
                                            ),
                                        )
                                    }
                                    placeholder="Unit price"
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    disabled={items.length === 1}
                                    onClick={() =>
                                        setItems(
                                            items.filter(
                                                (_, position) =>
                                                    position !== index,
                                            ),
                                        )
                                    }
                                >
                                    <Trash2 />
                                </Button>
                            </div>
                        ))}
                        <p className="text-right text-sm font-medium">
                            Subtotal: <Money cents={subtotal} />
                        </p>
                    </section>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Discount type</Label>
                            <Select
                                value={discountType}
                                onValueChange={(value) =>
                                    setDiscountType(
                                        value as 'fixed' | 'percentage',
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fixed">
                                        Fixed amount
                                    </SelectItem>
                                    <SelectItem value="percentage">
                                        Percentage
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Field
                            label={
                                discountType === 'percentage'
                                    ? 'Discount %'
                                    : 'Discount amount'
                            }
                            value={discount}
                            setValue={setDiscount}
                        />
                        <Field label="Tax %" value={tax} setValue={setTax} />
                        <Field
                            label="Joining fee"
                            value={joiningFee}
                            setValue={setJoiningFee}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="invoice-notes">Notes</Label>
                        <Textarea
                            id="invoice-notes"
                            value={notes}
                            onChange={(event) => setNotes(event.target.value)}
                        />
                    </div>
                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}
                    <Button disabled={saving}>
                        {saving ? 'Creating…' : 'Create invoice'}
                    </Button>
                </form>
            </main>
        </>
    );
}

function Field({
    label,
    value,
    setValue,
}: {
    label: string;
    value: string;
    setValue: (value: string) => void;
}) {
    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <Input
                type="number"
                min="0"
                step="0.01"
                value={value}
                onChange={(event) => setValue(event.target.value)}
            />
        </div>
    );
}
