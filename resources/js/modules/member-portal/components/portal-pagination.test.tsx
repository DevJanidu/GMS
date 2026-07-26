import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PortalPagination } from './portal-pagination';

describe('PortalPagination', () => {
    it('moves between bounded pages', () => {
        const onPageChange = vi.fn();
        render(
            <PortalPagination
                meta={{
                    current_page: 2,
                    per_page: 20,
                    total: 55,
                    last_page: 3,
                }}
                onPageChange={onPageChange}
            />,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
        fireEvent.click(screen.getByRole('button', { name: 'Next' }));

        expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
        expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
    });

    it('does not render for a single page', () => {
        const { container } = render(
            <PortalPagination
                meta={{
                    current_page: 1,
                    per_page: 20,
                    total: 5,
                    last_page: 1,
                }}
                onPageChange={vi.fn()}
            />,
        );

        expect(container).toBeEmptyDOMElement();
    });
});
