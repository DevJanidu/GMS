import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Permission } from '../types';
import { PermissionMatrix } from './permission-matrix';

const permissions: Permission[] = [
    { id: 1, name: 'View branches', slug: 'branches.view', group: 'Branches', description: null },
    { id: 2, name: 'Update branches', slug: 'branches.update', group: 'Branches', description: null },
    { id: 3, name: 'View roles', slug: 'roles.view', group: 'Roles', description: null },
];

describe('PermissionMatrix', () => {
    it('toggles a single permission on and off once its group is expanded', () => {
        const onChange = vi.fn();

        render(
            <PermissionMatrix
                permissions={permissions}
                selected={[]}
                onChange={onChange}
            />,
        );

        fireEvent.click(screen.getByText('Branches'));
        fireEvent.click(screen.getByRole('checkbox', { name: 'View branches' }));
        expect(onChange).toHaveBeenLastCalledWith([1]);
    });

    it('selects every permission in a group via its select-all checkbox', () => {
        const onChange = vi.fn();

        render(
            <PermissionMatrix
                permissions={permissions}
                selected={[]}
                onChange={onChange}
            />,
        );

        fireEvent.click(
            screen.getByRole('checkbox', {
                name: 'Select all Branches permissions',
            }),
        );
        expect(onChange).toHaveBeenLastCalledWith([1, 2]);
    });

    it('clears every permission in a group via its select-all checkbox', () => {
        const onChange = vi.fn();

        render(
            <PermissionMatrix
                permissions={permissions}
                selected={[1, 2, 3]}
                onChange={onChange}
            />,
        );

        fireEvent.click(
            screen.getByRole('checkbox', {
                name: 'Select all Branches permissions',
            }),
        );
        expect(onChange).toHaveBeenLastCalledWith([3]);
    });

    it('shows the overall selected count', () => {
        render(
            <PermissionMatrix
                permissions={permissions}
                selected={[1]}
                onChange={() => {}}
            />,
        );

        expect(
            screen.getByText('1 of 3 permissions selected'),
        ).toBeInTheDocument();
    });

    it('filters permissions by search text and auto-expands matching groups', () => {
        render(
            <PermissionMatrix
                permissions={permissions}
                selected={[]}
                onChange={() => {}}
            />,
        );

        fireEvent.change(screen.getByPlaceholderText('Search permissions'), {
            target: { value: 'roles' },
        });

        expect(screen.getByText('View roles')).toBeInTheDocument();
        expect(screen.queryByText('View branches')).not.toBeInTheDocument();
    });
});
