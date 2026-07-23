import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusBadge, toneForStatus } from './status-badge';

describe('toneForStatus', () => {
    it('maps known statuses to expected tones', () => {
        expect(toneForStatus('active')).toBe('success');
        expect(toneForStatus('Expired')).toBe('danger');
        expect(toneForStatus('pending')).toBe('warning');
    });

    it('falls back to neutral for unknown statuses', () => {
        expect(toneForStatus('something-unmapped')).toBe('neutral');
    });
});

describe('StatusBadge', () => {
    it('infers a tone from the status prop', () => {
        render(<StatusBadge status="expired">Expired</StatusBadge>);

        const badge = screen.getByText('Expired');

        expect(badge.className).toMatch(/red/);
    });

    it('lets an explicit tone override status inference', () => {
        render(
            <StatusBadge status="expired" tone="success">
                Expired
            </StatusBadge>,
        );

        const badge = screen.getByText('Expired');

        expect(badge.className).toMatch(/emerald/);
    });
});
