import { Head } from '@inertiajs/react';
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
import { Money } from '../components/money';
import { useBillingResource } from '../hooks/use-billing-resource';

const today = new Date().toISOString().slice(0, 10);

export default function CollectionSummaryPage() {
    const [from, setFrom] = useState(today);
    const [to, setTo] = useState(today);
    const [range, setRange] = useState({ from, to });
    const resource = useBillingResource(
        () => billingApi.collections(range.from, range.to),
        `${range.from}:${range.to}`,
    );
    const summary = resource.data?.data;

    return (
        <>
            <Head title="Daily collections" />
            <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
                <header>
                    <h1 className="text-2xl font-semibold">
                        Collection summary
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Cashier collections, refunds, and net totals by method.
                    </p>
                </header>
                <form
                    className="flex flex-wrap gap-3"
                    onSubmit={(event) => {
                        event.preventDefault();
                        setRange({ from, to });
                    }}
                >
                    <Input
                        className="w-44"
                        type="date"
                        value={from}
                        onChange={(event) => setFrom(event.target.value)}
                    />
                    <Input
                        className="w-44"
                        type="date"
                        value={to}
                        min={from}
                        onChange={(event) => setTo(event.target.value)}
                    />
                    <Button>Apply</Button>
                </form>
                <BillingState {...resource} retry={resource.reload} />
                {summary && (
                    <>
                        <section className="grid gap-4 sm:grid-cols-3">
                            {[
                                ['Gross collections', summary.gross_cents],
                                ['Refunds', summary.refunded_cents],
                                ['Net collections', summary.net_cents],
                            ].map(([label, cents]) => (
                                <Card key={String(label)}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            {label}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-2xl font-semibold">
                                        <Money cents={Number(cents)} />
                                    </CardContent>
                                </Card>
                            ))}
                        </section>
                        <div className="rounded-xl border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Method</TableHead>
                                        <TableHead className="text-right">
                                            Gross
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Refunds
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Net
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Object.entries(summary.by_method).map(
                                        ([method, totals]) => (
                                            <TableRow key={method}>
                                                <TableCell className="capitalize">
                                                    {method.replaceAll(
                                                        '_',
                                                        ' ',
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Money
                                                        cents={
                                                            totals.gross_cents
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Money
                                                        cents={
                                                            totals.refunded_cents
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    <Money
                                                        cents={totals.net_cents}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ),
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </>
                )}
            </main>
        </>
    );
}
