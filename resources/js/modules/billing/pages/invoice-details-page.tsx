import { Head } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { billingApi } from '../api/billing';
import { BillingState } from '../components/billing-state';
import { InvoiceStatus } from '../components/invoice-status';
import { Money } from '../components/money';
import { PaymentForm } from '../components/payment-form';
import { SplitPaymentForm } from '../components/split-payment-form';
import { useBillingResource } from '../hooks/use-billing-resource';
import type { Invoice, Payment } from '../types';

export default function InvoiceDetailsPage({
    invoiceId,
}: {
    invoiceId: number;
}) {
    const resource = useBillingResource(
        () => billingApi.invoice(invoiceId),
        String(invoiceId),
    );
    const [actionError, setActionError] = useState('');

    return (
        <>
            <Head title="Invoice details" />
            <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
                <BillingState {...resource} retry={resource.reload} />
                {resource.data && (
                    <>
                        <header className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-semibold">
                                        {resource.data.data.invoice_number}
                                    </h1>
                                    <InvoiceStatus
                                        status={resource.data.data.status}
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {resource.data.data.member?.name ??
                                        'Walk-in invoice'}{' '}
                                    · Issued {resource.data.data.issued_on}
                                </p>
                            </div>
                            {resource.data.data.status === 'open' && (
                                <Button
                                    variant="destructive"
                                    onClick={async () => {
                                        const reason = window.prompt(
                                            'Reason for voiding this invoice',
                                        );

                                        if (!reason) {
                                            return;
                                        }

                                        try {
                                            await billingApi.voidInvoice(
                                                invoiceId,
                                                reason,
                                            );
                                            resource.reload();
                                        } catch (error) {
                                            setActionError(
                                                error instanceof Error
                                                    ? error.message
                                                    : 'Unable to void invoice.',
                                            );
                                        }
                                    }}
                                >
                                    Void invoice
                                </Button>
                            )}
                        </header>
                        {actionError && (
                            <p className="text-sm text-destructive">
                                {actionError}
                            </p>
                        )}
                        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Invoice items</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Item</TableHead>
                                                <TableHead>Qty</TableHead>
                                                <TableHead className="text-right">
                                                    Total
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {resource.data.data.items?.map(
                                                (item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>
                                                            {item.description}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.quantity}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Money
                                                                cents={
                                                                    item.line_total_cents
                                                                }
                                                                currency={
                                                                    resource
                                                                        .data
                                                                        ?.data
                                                                        .currency
                                                                }
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ),
                                            )}
                                        </TableBody>
                                    </Table>
                                    <Totals invoice={resource.data.data} />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Record payment</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {resource.data.data.balance_due_cents > 0 &&
                                    resource.data.data.status !== 'void' ? (
                                        <PaymentForm
                                            invoiceId={invoiceId}
                                            balanceCents={
                                                resource.data.data
                                                    .balance_due_cents
                                            }
                                            onSaved={resource.reload}
                                        />
                                    ) : resource.data.data.status ===
                                      'paid' ? (
                                        <div className="flex items-center gap-2 rounded-lg border border-emerald-600/30 bg-emerald-50 px-4 py-3 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                                            <CheckCircle2 className="size-5" />
                                            <span className="text-sm font-semibold">
                                                Fully paid
                                            </span>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            This invoice has no payable balance.
                                        </p>
                                    )}
                                    {resource.data.data.balance_due_cents > 0 &&
                                        resource.data.data.status !==
                                            'void' && (
                                            <SplitPaymentForm
                                                invoiceId={invoiceId}
                                                balanceCents={
                                                    resource.data.data
                                                        .balance_due_cents
                                                }
                                                onSaved={resource.reload}
                                            />
                                        )}
                                </CardContent>
                            </Card>
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Immutable payment history</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {resource.data.data.payments?.map((payment) => (
                                    <PaymentRow
                                        key={payment.id}
                                        payment={payment}
                                        currency={
                                            resource.data?.data.currency ??
                                            'LKR'
                                        }
                                        onChanged={resource.reload}
                                    />
                                ))}
                                {!resource.data.data.payments?.length && (
                                    <p className="text-sm text-muted-foreground">
                                        No payments recorded.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}
            </main>
        </>
    );
}

function Totals({ invoice }: { invoice: Invoice }) {
    return (
        <dl className="mt-6 ml-auto grid max-w-sm grid-cols-2 gap-2 text-sm">
            <dt>Subtotal</dt>
            <dd className="text-right">
                <Money
                    cents={invoice.subtotal_cents}
                    currency={invoice.currency}
                />
            </dd>
            <dt>Discount</dt>
            <dd className="text-right">
                −
                <Money
                    cents={invoice.discount_cents}
                    currency={invoice.currency}
                />
            </dd>
            <dt>Joining fee</dt>
            <dd className="text-right">
                <Money
                    cents={invoice.joining_fee_cents}
                    currency={invoice.currency}
                />
            </dd>
            <dt>Tax</dt>
            <dd className="text-right">
                <Money cents={invoice.tax_cents} currency={invoice.currency} />
            </dd>
            <dt className="font-semibold">Grand total</dt>
            <dd className="text-right font-semibold">
                <Money
                    cents={invoice.grand_total_cents}
                    currency={invoice.currency}
                />
            </dd>
            <dt className="font-semibold">Balance</dt>
            <dd className="text-right font-semibold">
                <Money
                    cents={invoice.balance_due_cents}
                    currency={invoice.currency}
                />
            </dd>
        </dl>
    );
}

function PaymentRow({
    payment,
    currency,
    onChanged,
}: {
    payment: Payment;
    currency: string;
    onChanged: () => void;
}) {
    const refundable = payment.amount_cents - payment.refunded_cents;
    const [refundAmount, setRefundAmount] = useState(
        (refundable / 100).toFixed(2),
    );
    const [reason, setReason] = useState('');

    return (
        <div className="grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_auto]">
            <div>
                <p className="font-medium">
                    {payment.payment_number} ·{' '}
                    <Money cents={payment.amount_cents} currency={currency} />
                </p>
                <p className="text-sm text-muted-foreground capitalize">
                    {payment.method.replaceAll('_', ' ')} · {payment.paid_at}
                </p>
                {payment.receipt && (
                    <a
                        className="text-sm text-primary hover:underline"
                        href={`/billing/receipts/${payment.receipt.id}`}
                    >
                        {payment.receipt.receipt_number}
                    </a>
                )}
            </div>
            {refundable > 0 && (
                <form
                    className="flex flex-wrap items-end gap-2"
                    onSubmit={async (event) => {
                        event.preventDefault();
                        await billingApi.refund(payment.id, {
                            amount_cents: Math.round(
                                Number(refundAmount) * 100,
                            ),
                            reason,
                            idempotency_key: crypto.randomUUID(),
                        });
                        onChanged();
                    }}
                >
                    <Input
                        className="w-28"
                        type="number"
                        min="0.01"
                        max={refundable / 100}
                        step="0.01"
                        value={refundAmount}
                        onChange={(event) =>
                            setRefundAmount(event.target.value)
                        }
                        aria-label="Refund amount"
                        required
                    />
                    <Input
                        className="w-48"
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        placeholder="Refund reason"
                        minLength={3}
                        required
                    />
                    <Button variant="outline">Refund</Button>
                </form>
            )}
        </div>
    );
}
