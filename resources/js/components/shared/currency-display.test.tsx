import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CurrencyDisplay } from './currency-display';

describe('CurrencyDisplay', () => {
    it('formats an amount using the given currency code', () => {
        render(<CurrencyDisplay amount={48000} currency="USD" />);

        const text = screen.getByText(/48,000/);

        expect(text.textContent).toContain('$');
    });

    it('respects a different currency code', () => {
        render(<CurrencyDisplay amount={1500.5} currency="EUR" />);

        expect(screen.getByText(/1,500.5/)).toBeInTheDocument();
    });
});
