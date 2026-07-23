import type * as InertiaReact from '@inertiajs/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { User } from '@/types';
import { PermissionGate } from './permission-gate';

const usePageMock = vi.fn();

vi.mock('@inertiajs/react', async (importOriginal) => {
    const actual = await importOriginal<typeof InertiaReact>();

    return {
        ...actual,
        usePage: () => usePageMock(),
    };
});

function withUser(permissions: string[] | undefined) {
    usePageMock.mockReturnValue({
        props: { auth: { user: { permissions } as unknown as User } },
    });
}

describe('PermissionGate', () => {
    it('renders children when the user holds the required permission', () => {
        withUser(['dashboard.view']);

        render(
            <PermissionGate permission="dashboard.view">
                <p>Secret widget</p>
            </PermissionGate>,
        );

        expect(screen.getByText('Secret widget')).toBeInTheDocument();
    });

    it('renders the fallback when the permission is missing', () => {
        withUser(['dashboard.view']);

        render(
            <PermissionGate
                permission="dashboard.financials.view"
                fallback={<p>Restricted</p>}
            >
                <p>Secret widget</p>
            </PermissionGate>,
        );

        expect(screen.queryByText('Secret widget')).not.toBeInTheDocument();
        expect(screen.getByText('Restricted')).toBeInTheDocument();
    });

    it('renders nothing by default when permissions are entirely absent', () => {
        withUser(undefined);

        const { container } = render(
            <PermissionGate permission="dashboard.view">
                <p>Secret widget</p>
            </PermissionGate>,
        );

        expect(container).toBeEmptyDOMElement();
    });
});
