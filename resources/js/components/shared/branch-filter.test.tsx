import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BranchFilter } from './branch-filter';

describe('BranchFilter', () => {
    it('shows the "all branches" label when no branch is selected', () => {
        render(
            <BranchFilter
                branches={[{ id: 1, name: 'Colombo' }]}
                value={null}
                onChange={() => {}}
            />,
        );

        expect(screen.getByText('All branches')).toBeInTheDocument();
    });

    it('is disabled when there are no branches to choose from', () => {
        render(<BranchFilter branches={[]} value={null} onChange={() => {}} />);

        expect(screen.getByRole('combobox')).toBeDisabled();
    });
});
