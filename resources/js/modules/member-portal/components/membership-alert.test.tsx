import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { PortalMembership } from '../types';
import { MembershipAlert } from './membership-alert';

function membership(
    status: PortalMembership['status'],
): PortalMembership {
    return {
        id: 1,
        status,
        status_label: status,
        plan_name: 'Gold',
        starts_on: '2026-01-01',
        expires_on: status === 'expired' ? '2026-01-31' : '2099-01-31',
        grace_ends_on: '2099-02-07',
        expired: status === 'expired',
        in_grace_period: false,
        freeze_started_on: status === 'frozen' ? '2026-07-01' : null,
        freeze_resumes_on: status === 'frozen' ? '2026-08-01' : null,
        branch: { name: 'Central' },
    };
}

describe('MembershipAlert', () => {
    it('shows empty, expired, frozen and suspended membership states', () => {
        const { rerender } = render(<MembershipAlert membership={null} />);
        expect(screen.getByText('No active membership')).toBeInTheDocument();

        rerender(<MembershipAlert membership={membership('expired')} />);
        expect(screen.getByText('Membership expired')).toBeInTheDocument();

        rerender(<MembershipAlert membership={membership('frozen')} />);
        expect(screen.getByText('Membership frozen')).toBeInTheDocument();

        rerender(<MembershipAlert membership={membership('suspended')} />);
        expect(screen.getByText('Membership suspended')).toBeInTheDocument();
    });

    it('renders no warning for a current active membership', () => {
        const { container } = render(
            <MembershipAlert membership={membership('active')} />,
        );

        expect(container).toBeEmptyDOMElement();
    });
});
