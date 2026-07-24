import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ScannerPage from './scanner-page';

vi.mock('@inertiajs/react', () => ({
    Head: () => null,
}));

describe('ScannerPage', () => {
    beforeEach(() => {
        Object.defineProperty(navigator, 'mediaDevices', {
            configurable: true,
            value: undefined,
        });
        Object.defineProperty(window, 'BarcodeDetector', {
            configurable: true,
            value: undefined,
        });
    });

    it('shows a safe camera-not-supported state with a paste fallback', () => {
        render(<ScannerPage branchId={1} />);

        fireEvent.click(screen.getByRole('button', { name: 'Start camera' }));

        expect(
            screen.getByText(
                'QR camera scanning is not supported by this browser.',
            ),
        ).toBeInTheDocument();
        expect(screen.getByLabelText('QR token')).toBeInTheDocument();
    });
});
