import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DateRangePicker } from './date-range-picker';

describe('DateRangePicker', () => {
    it('displays the selected range on the trigger button', () => {
        render(
            <DateRangePicker
                value={{ from: '2026-06-23', to: '2026-07-23' }}
                onChange={() => {}}
            />,
        );

        expect(
            screen.getByRole('button', { name: /Jun 23.*Jul 23/ }),
        ).toBeInTheDocument();
    });

    it('applies a preset range when clicked', async () => {
        const onChange = vi.fn();

        render(
            <DateRangePicker
                value={{ from: '2026-06-23', to: '2026-07-23' }}
                onChange={onChange}
            />,
        );

        fireEvent.click(screen.getByRole('button', { name: /Jun 23.*Jul 23/ }));

        const preset = await screen.findByRole('button', {
            name: 'Last 7 days',
        });
        fireEvent.click(preset);

        expect(onChange).toHaveBeenCalledTimes(1);
        const [range] = onChange.mock.calls[0];
        expect(range).toHaveProperty('from');
        expect(range).toHaveProperty('to');
    });
});
