import { render, screen } from '@testing-library/react';
import { Users } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { StatCard } from './stat-card';

describe('StatCard', () => {
    it('renders a value and helper text when ready', () => {
        render(
            <StatCard label="Active members" value="1,248" icon={Users} helper="+8.2%" />,
        );

        expect(screen.getByText('Active members')).toBeInTheDocument();
        expect(screen.getByText('1,248')).toBeInTheDocument();
        expect(screen.getByText('+8.2%')).toBeInTheDocument();
    });

    it('wraps the card in a link when href is provided and the state is ready', () => {
        render(
            <StatCard
                label="Active members"
                value="1,248"
                icon={Users}
                href="/members?status=active"
            />,
        );

        expect(screen.getByRole('link')).toHaveAttribute(
            'href',
            '/members?status=active',
        );
    });

    it('renders a restricted message instead of a value', () => {
        render(
            <StatCard
                label="Revenue"
                icon={Users}
                state="restricted"
                message="You do not have permission to view financial data."
            />,
        );

        expect(
            screen.getByText(
                'You do not have permission to view financial data.',
            ),
        ).toBeInTheDocument();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('renders a pending-integration message', () => {
        render(
            <StatCard
                label="Revenue"
                icon={Users}
                state="pending_integration"
                message="Billing has not published its API yet."
            />,
        );

        expect(
            screen.getByText('Billing has not published its API yet.'),
        ).toBeInTheDocument();
    });
});
