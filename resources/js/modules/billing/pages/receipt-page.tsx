import { Head } from '@inertiajs/react';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Money } from '../components/money';
import { useBillingResource } from '../hooks/use-billing-resource';

export default function ReceiptPage({ receiptId }: { receiptId: number }) {
    const resource = useBillingResource(
        () => billingApi.receipt(receiptId),
        String(receiptId),
    );
    const receipt = resource.data?.data;

    return (
        <>
            <Head title="Receipt" />
            <main className="mx-auto w-full max-w-3xl p-4 sm:p-6 print:p-0">
                <BillingState {...resource} retry={resource.reload} />
                {receipt && (
                    <article className="space-y-6 rounded-xl border p-6 print:border-0">
                        <header className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold">
                                    Payment receipt
                                </h1>
                                <p>{receipt.receipt_number}</p>
                            </div>
                            <Button asChild className="print:hidden">
                                <a
                                    href={billingApi.printReceiptUrl(
                                        receipt.id,
                                    )}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <Printer /> Printable receipt
                                </a>
                            </Button>
                        </header>
                        <dl className="grid grid-cols-2 gap-2 text-sm">
                            <dt className="text-muted-foreground">Invoice</dt>
                            <dd>{receipt.snapshot.invoice_number}</dd>
                            <dt className="text-muted-foreground">Member</dt>
                            <dd>{receipt.snapshot.member ?? 'Walk-in'}</dd>
                            <dt className="text-muted-foreground">Branch</dt>
                            <dd>{receipt.snapshot.branch ?? '—'}</dd>
                            <dt className="text-muted-foreground">Paid at</dt>
                            <dd>{receipt.snapshot.paid_at}</dd>
                            <dt className="text-muted-foreground">Method</dt>
                            <dd className="capitalize">
                                {receipt.snapshot.method.replaceAll('_', ' ')}
                            </dd>
                        </dl>
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
                                {receipt.snapshot.items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            {item.description}
                                        </TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell className="text-right">
                                            <Money
                                                cents={item.line_total_cents}
                                                currency={
                                                    receipt.snapshot.currency
                                                }
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <p className="text-right text-xl font-semibold">
                            Paid:{' '}
                            <Money
                                cents={receipt.snapshot.amount_cents}
                                currency={receipt.snapshot.currency}
                            />
                        </p>
                    </article>
                )}
            </main>
        </>
    );
}
