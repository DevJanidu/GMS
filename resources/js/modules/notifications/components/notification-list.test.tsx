import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NotificationList } from './notification-list';

const unread = {
    id: 'one',
    type: 'membership',
    title: 'Membership expiring',
    body: 'Renew soon.',
    readAt: null,
    createdAt: '2026-07-24T10:00:00Z',
    failed: true,
};

describe('NotificationList', () => {
    it('supports read actions without exposing delivery failures by default', () => {
        const onRead = vi.fn();
        render(
            <NotificationList notifications={[unread]} onRead={onRead} />,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Mark as read' }));

        expect(onRead).toHaveBeenCalledWith('one');
        expect(screen.queryByText('Delivery failed')).not.toBeInTheDocument();
    });

    it('shows failure indicators only when explicitly permitted', () => {
        render(
            <NotificationList
                notifications={[unread]}
                canSeeFailures
            />,
        );

        expect(screen.getByText('Delivery failed')).toBeInTheDocument();
    });

    it('renders an empty state', () => {
        render(<NotificationList notifications={[]} />);
        expect(screen.getByText("You're all caught up")).toBeInTheDocument();
    });
});
