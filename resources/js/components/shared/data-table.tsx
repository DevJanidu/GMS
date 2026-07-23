import type { ReactNode } from 'react';
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
    empty,
}: {
    columns: DataTableColumn<T>[];
    rows: T[];
    getRowKey: (row: T) => string | number;
    empty?: ReactNode;
}) {
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
                        {rows.map((row) => (
                            <tr
                                key={getRowKey(row)}
                                className="hover:bg-muted/40 transition-colors"
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={cn(
                                            'px-4 py-3',
                                            column.className,
                                        )}
                                    >
                                        {column.cell(row)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
