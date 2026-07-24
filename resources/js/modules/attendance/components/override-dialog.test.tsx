import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { OverrideDialog } from './override-dialog';

describe('OverrideDialog', () => {
    it('requires a meaningful reason before confirming the audited override', () => {
        const onConfirm = vi.fn();
        render(
            <OverrideDialog
                open
                reasonCode="membership_expired"
                onClose={() => {}}
                onConfirm={onConfirm}
            />,
        );

        const confirm = screen.getByRole('button', {
            name: 'Apply audited override',
        });
        expect(confirm).toBeDisabled();

        fireEvent.change(screen.getByLabelText('Reason'), {
            target: { value: 'Manager approved one-time entry.' },
        });
        expect(confirm).toBeEnabled();

        fireEvent.click(confirm);
        expect(onConfirm).toHaveBeenCalledWith(
            'Manager approved one-time entry.',
        );
    });
});
