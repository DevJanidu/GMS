import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { ErrorState } from '@/components/shared/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export type DataTableColumn<T> = {
    key: string;
    header: string;
    cell: (row: T) => ReactNode;
    className?: string;
};

export function DataTable<T>({
    columns,
    rows,
    getRowKey,
    getRowHref,
    empty,
    isLoading = false,
    error,
    onRetry,
    skeletonRows = 4,
}: {
    columns: DataTableColumn<T>[];
    rows: T[];
    getRowKey: (row: T) => string | number;
    /** When provided, each row becomes a link — used for dashboard drill-downs into a record's detail page. */
    getRowHref?: (row: T) => string;
    empty?: ReactNode;
    isLoading?: boolean;
    error?: string | null;
    onRetry?: () => void;
    skeletonRows?: number;
}) {
    if (error) {
        return <ErrorState description={error} onRetry={onRetry} />;
    }

    if (isLoading) {
        return (
            <div className="space-y-2">
                {Array.from({ length: skeletonRows }).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-full rounded-lg" />
                ))}
            </div>
        );
    }

    if (rows.length === 0) {
        return <>{empty}</>;
    }

    return (
        <div className="overflow-hidden rounded-xl border">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-muted/60 text-muted-foreground">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={cn(
                                        'px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase',
                                        column.className,
                                    )}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {rows.map((row) => {
                            const href = getRowHref?.(row);

                            return (
                                <tr
                                    key={getRowKey(row)}
                                    className="hover:bg-muted/40 transition-colors"
                                >
                                    {columns.map((column, index) => (
                                        <td
                                            key={column.key}
                                            className={cn(
                                                'px-4 py-3',
                                                column.className,
                                            )}
                                        >
                                            {href && index === 0 ? (
                                                <Link
                                                    href={href}
                                                    className="focus-visible:ring-ring block rounded outline-none focus-visible:ring-2"
                                                >
                                                    {column.cell(row)}
                                                </Link>
                                            ) : (
                                                column.cell(row)
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
