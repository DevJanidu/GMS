import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ChartConfig } from '@/components/ui/chart';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import type { ReportResult } from '../types';

export function ReportResultView({
    result,
    onPageChange,
}: {
    result: ReportResult;
    onPageChange?: (page: number) => void;
}) {
    if (result.table.rows.length === 0 && result.kpis.length === 0) {
        return (
            <EmptyState
                title="No report data"
                description="No source records match the selected filters."
            />
        );
    }

    const chartConfig = result.chart
        ? ({
              [result.chart.value_key]: {
                  label: result.chart.value_label,
                  color: 'var(--chart-2)',
              },
          } satisfies ChartConfig)
        : {};

    return (
        <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {result.kpis.map((kpi) => (
                    <Card key={kpi.key}>
                        <CardContent className="p-5">
                            <p className="text-sm text-muted-foreground">
                                {kpi.label}
                            </p>
                            <p className="mt-2 text-2xl font-bold">
                                {kpi.value}
                            </p>
                            {kpi.helper && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {kpi.helper}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </section>

            {result.chart && result.chart.items.length > 0 && (
                <Card className="print:break-inside-avoid">
                    <CardHeader>
                        <CardTitle>{result.chart.value_label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={chartConfig}
                            className="h-72 w-full"
                        >
                            <BarChart
                                accessibilityLayer
                                data={result.chart.items}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey={result.chart.label_key}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis tickLine={false} axisLine={false} />
                                <ChartTooltip
                                    content={<ChartTooltipContent />}
                                />
                                <Bar
                                    dataKey={result.chart.value_key}
                                    fill={`var(--color-${result.chart.value_key})`}
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            )}

            <div className="overflow-hidden rounded-xl border bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/60">
                            <tr>
                                {result.table.columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className={
                                            column.align === 'right'
                                                ? 'px-4 py-3 text-right'
                                                : 'px-4 py-3 text-left'
                                        }
                                    >
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {result.table.rows.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {result.table.columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className={
                                                column.align === 'right'
                                                    ? 'px-4 py-3 text-right'
                                                    : 'px-4 py-3'
                                            }
                                        >
                                            {row[column.key] ?? '—'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {result.meta.last_page > 1 && onPageChange && (
                <nav
                    aria-label="Report pagination"
                    className="flex items-center justify-between gap-3 print:hidden"
                >
                    <p className="text-sm text-muted-foreground">
                        Page {result.meta.current_page} of {result.meta.last_page}
                        {' · '}
                        {result.meta.total.toLocaleString()} rows
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={result.meta.current_page <= 1}
                            onClick={() =>
                                onPageChange(result.meta.current_page - 1)
                            }
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={
                                result.meta.current_page >= result.meta.last_page
                            }
                            onClick={() =>
                                onPageChange(result.meta.current_page + 1)
                            }
                        >
                            Next
                        </Button>
                    </div>
                </nav>
            )}
        </>
    );
}
