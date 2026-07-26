import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { DataTableColumn } from './data-table';
import { DataTable } from './data-table';

type Row = { id: number; name: string };

const columns: DataTableColumn<Row>[] = [
    { key: 'name', header: 'Name', cell: (row) => row.name },
];

describe('DataTable', () => {
    it('renders a skeleton while loading instead of rows', () => {
        render(
            <DataTable
                columns={columns}
                rows={[{ id: 1, name: 'Colombo' }]}
                getRowKey={(row) => row.id}
                isLoading
            />,
        );

        expect(screen.queryByText('Colombo')).not.toBeInTheDocument();
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    it('renders an error state with a retry action', () => {
        const onRetry = vi.fn();

        render(
            <DataTable
                columns={columns}
                rows={[]}
                getRowKey={(row) => row.id}
                error="Something broke"
                onRetry={onRetry}
            />,
        );

        expect(screen.getByText('Something broke')).toBeInTheDocument();

        screen.getByRole('button', { name: /try again/i }).click();
        expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('renders the empty slot when there are no rows', () => {
        render(
            <DataTable
                columns={columns}
                rows={[]}
                getRowKey={(row) => row.id}
                empty={<p>Nothing here</p>}
            />,
        );

        expect(screen.getByText('Nothing here')).toBeInTheDocument();
    });

    it('renders rows and wraps the first cell in a link when getRowHref is given', () => {
        render(
            <DataTable
                columns={columns}
                rows={[{ id: 1, name: 'Colombo' }]}
                getRowKey={(row) => row.id}
                getRowHref={(row) => `/branches/${row.id}`}
            />,
        );

        const link = screen.getByRole('link', { name: 'Colombo' });

        expect(link).toHaveAttribute('href', '/branches/1');
    });
});
