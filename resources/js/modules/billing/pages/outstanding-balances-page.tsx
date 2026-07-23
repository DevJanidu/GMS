import { Head } from '@inertiajs/react';
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

export default function OutstandingBalancesPage() {
    const resource = useBillingResource(() => billingApi.outstanding());

    return (
        <>
            <Head title="Outstanding balances" />
            <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
                <header>
                    <h1 className="text-2xl font-semibold">
                        Outstanding balances
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Open balances for the active branch.
                    </p>
                </header>
                <BillingState {...resource} retry={resource.reload} />
                {resource.data && (
                    <>
                        <div className="rounded-xl border p-5">
                            <p className="text-sm text-muted-foreground">
                                Total outstanding
                            </p>
                            <p className="text-3xl font-semibold">
                                <Money
                                    cents={
                                        resource.data.summary
                                            ?.outstanding_cents ?? 0
                                    }
                                />
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {resource.data.summary?.invoice_count ?? 0}{' '}
                                invoices
                            </p>
                        </div>
                        <div className="rounded-xl border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Invoice</TableHead>
                                        <TableHead>Member</TableHead>
                                        <TableHead>Due</TableHead>
                                        <TableHead className="text-right">
                                            Balance
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {resource.data.data.map((invoice) => (
                                        <TableRow key={invoice.id}>
                                            <TableCell>
                                                <a
                                                    href={`/billing/invoices/${invoice.id}`}
                                                    className="font-medium hover:underline"
                                                >
                                                    {invoice.invoice_number}
                                                </a>
                                            </TableCell>
                                            <TableCell>
                                                {invoice.member?.name ??
                                                    'Walk-in'}
                                            </TableCell>
                                            <TableCell>
                                                {invoice.due_on ?? '—'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Money
                                                    cents={
                                                        invoice.balance_due_cents
                                                    }
                                                    currency={invoice.currency}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </>
                )}
            </main>
        </>
    );
}
