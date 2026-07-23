import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { DashboardSection } from '../types';
import { SectionBoundary } from './section-boundary';

describe('SectionBoundary', () => {
    it('renders children with the data when available', () => {
        const section: DashboardSection<{ count: number }> = {
            status: 'available',
            data: { count: 42 },
        };

        render(
            <SectionBoundary section={section}>
                {(data: { count: number }) => <p>Count: {data.count}</p>}
            </SectionBoundary>,
        );

        expect(screen.getByText('Count: 42')).toBeInTheDocument();
    });

    it('renders a restricted empty state distinct from pending integration', () => {
        const restricted: DashboardSection<{ count: number }> = {
            status: 'restricted',
            message: 'You do not have permission to view financial data.',
        };

        render(
            <SectionBoundary section={restricted}>
                {(data: { count: number }) => <p>Count: {data.count}</p>}
            </SectionBoundary>,
        );

        expect(screen.getByText('Restricted')).toBeInTheDocument();
        expect(
            screen.getByText(
                'You do not have permission to view financial data.',
            ),
        ).toBeInTheDocument();
    });

    it('renders a pending-integration empty state', () => {
        const pending: DashboardSection<{ count: number }> = {
            status: 'pending_integration',
            message: 'Billing has not published its API yet.',
        };

        render(
            <SectionBoundary section={pending}>
                {(data: { count: number }) => <p>Count: {data.count}</p>}
            </SectionBoundary>,
        );

        expect(screen.getByText('Awaiting integration')).toBeInTheDocument();
    });
});
