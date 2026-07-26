import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { useBillingResource } from '../hooks/use-billing-resource';

export default function InvoiceListPage() {
    const [search, setSearch] = useState('');
    const query = useMemo(
        () => (search ? `?search=${encodeURIComponent(search)}` : ''),
        [search],
    );
    const resource = useBillingResource(
        () => billingApi.invoices(query),
        query,
    );

    return (
        <>
            <Head title="Invoices" />
            <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Invoices</h1>
                        <p className="text-sm text-muted-foreground">
                            Billing, payment status, and balances for this
                            branch.
                        </p>
                    </div>
                    <Button asChild>
                        <a href="/billing/invoices/create">
                            <Plus /> Create invoice
                        </a>
                    </Button>
                </header>
                <Input
                    className="max-w-sm"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search invoice or member"
                    aria-label="Search invoices"
                />
                <BillingState {...resource} retry={resource.reload} />
                {resource.data && (
                    <div className="overflow-hidden rounded-xl border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice</TableHead>
                                    <TableHead>Member</TableHead>
                                    <TableHead>Issued</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Total
                                    </TableHead>
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
                                                className="font-medium hover:underline"
                                                href={`/billing/invoices/${invoice.id}`}
                                            >
                                                {invoice.invoice_number}
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            {invoice.member?.name ?? 'Walk-in'}
                                        </TableCell>
                                        <TableCell>
                                            {invoice.issued_on}
                                        </TableCell>
                                        <TableCell>
                                            <InvoiceStatus
                                                status={invoice.status}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Money
                                                cents={
                                                    invoice.grand_total_cents
                                                }
                                                currency={invoice.currency}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            <Money
                                                cents={
                                                    invoice.balance_due_cents
                                                }
                                                currency={invoice.currency}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {resource.data.data.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            No invoices found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </main>
        </>
    );
}
