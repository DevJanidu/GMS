import { Head } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { apiClient } from '@/lib/api/client';
import type { ApiSuccess } from '@/lib/api/client';
import { BillingState } from '../components/billing-state';
import { Money } from '../components/money';
import { useBillingResource } from '../hooks/use-billing-resource';
import type { Payment } from '../types';

export default function PaymentHistoryPage() {
    const resource = useBillingResource(() =>
        apiClient.get<ApiSuccess<Payment[]>>('/billing/payments?per_page=100'),
    );

    return (
        <>
            <Head title="Payment history" />
            <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
                <header>
                    <h1 className="text-2xl font-semibold">Payment history</h1>
                    <p className="text-sm text-muted-foreground">
                        Append-only payments and linked receipts.
                    </p>
                </header>
                <BillingState {...resource} retry={resource.reload} />
                {resource.data && (
                    <div className="rounded-xl border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Payment</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead className="text-right">
                                        Amount
                                    </TableHead>
                                    <TableHead>Receipt</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {resource.data.data.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell className="font-medium">
                                            {payment.payment_number}
                                        </TableCell>
                                        <TableCell>{payment.paid_at}</TableCell>
                                        <TableCell className="capitalize">
                                            {payment.method.replaceAll(
                                                '_',
                                                ' ',
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Money
                                                cents={payment.amount_cents}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {payment.receipt ? (
                                                <a
                                                    className="text-primary hover:underline"
                                                    href={`/billing/receipts/${payment.receipt.id}`}
                                                >
                                                    {
                                                        payment.receipt
                                                            .receipt_number
                                                    }
                                                </a>
                                            ) : (
                                                '—'
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </main>
        </>
    );
}
