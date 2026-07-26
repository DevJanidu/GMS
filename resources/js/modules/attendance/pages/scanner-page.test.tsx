import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

    it('still attempts the camera when BarcodeDetector is missing but getUserMedia exists (Safari/Firefox)', async () => {
        const getUserMedia = vi.fn().mockRejectedValue(new Error('denied'));

        Object.defineProperty(navigator, 'mediaDevices', {
            configurable: true,
            value: { getUserMedia },
        });

        render(<ScannerPage branchId={1} />);

        fireEvent.click(screen.getByRole('button', { name: 'Start camera' }));

        await screen.findByText('Camera permission was denied.');

        expect(getUserMedia).toHaveBeenCalled();
        expect(
            screen.queryByText(
                'QR camera scanning is not supported by this browser.',
            ),
        ).not.toBeInTheDocument();
    });

    it('regression: does not stop its own camera stream the instant scanning starts', async () => {
        const stop = vi.fn();
        const stream = { getTracks: () => [{ stop }] } as unknown as MediaStream;
        const getUserMedia = vi.fn().mockResolvedValue(stream);

        Object.defineProperty(navigator, 'mediaDevices', {
            configurable: true,
            value: { getUserMedia },
        });
        HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);

        render(<ScannerPage branchId={1} />);

        fireEvent.click(screen.getByRole('button', { name: 'Start camera' }));

        await waitFor(() => expect(getUserMedia).toHaveBeenCalled());

        // Give the effect-cleanup cycle (idle -> requesting -> scanning) a
        // chance to run; before the fix, this is where the stream got
        // stopped and the UI bounced back to "Camera is stopped."
        await waitFor(() => {
            expect(
                screen.queryByText('Camera is stopped.'),
            ).not.toBeInTheDocument();
        });
        expect(stop).not.toHaveBeenCalled();
    });
});
