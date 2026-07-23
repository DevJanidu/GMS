import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MoneyInput } from './money-input';

describe('MoneyInput', () => {
    it('shows the currency symbol for the given currency code', () => {
        render(<MoneyInput value={null} currency="USD" onChange={() => {}} />);

        expect(screen.getByText('$')).toBeInTheDocument();
    });

    it('renders an unmapped currency code as its own symbol', () => {
        render(<MoneyInput value={null} currency="AUD" onChange={() => {}} />);

        expect(screen.getByText('AUD')).toBeInTheDocument();
    });

    it('emits a parsed number on change and null when cleared', () => {
        const onChange = vi.fn();

        render(<MoneyInput value={10} currency="USD" onChange={onChange} />);

        const input = screen.getByRole('spinbutton');

        fireEvent.change(input, { target: { value: '25.5' } });
        expect(onChange).toHaveBeenLastCalledWith(25.5);

        fireEvent.change(input, { target: { value: '' } });
        expect(onChange).toHaveBeenLastCalledWith(null);
    });
});
