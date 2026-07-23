import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ActivityTimeline } from './activity-timeline';

describe('ActivityTimeline', () => {
    it('renders each item with its title, detail and time label', () => {
        render(
            <ActivityTimeline
                items={[
                    {
                        id: 1,
                        title: 'New member joined',
                        detail: 'Nethmi Perera',
                        timeLabel: '8 min ago',
                    },
                ]}
            />,
        );

        expect(screen.getByText('New member joined')).toBeInTheDocument();
        expect(screen.getByText('Nethmi Perera')).toBeInTheDocument();
        expect(screen.getByText('8 min ago')).toBeInTheDocument();
    });

    it('shows an empty state when there are no items', () => {
        render(
            <ActivityTimeline
                items={[]}
                emptyTitle="Nothing yet"
                emptyDescription="Check back later."
            />,
        );

        expect(screen.getByText('Nothing yet')).toBeInTheDocument();
        expect(screen.getByText('Check back later.')).toBeInTheDocument();
    });
});
