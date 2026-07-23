import type { Permission } from '../types';

type PermissionMatrixProps = {
    permissions: Permission[];
    selected: number[];
    onChange: (selected: number[]) => void;
    disabled?: boolean;
};

export function PermissionMatrix({
    permissions,
    selected,
    onChange,
    disabled,
}: PermissionMatrixProps) {
    const groups = permissions.reduce<Record<string, Permission[]>>(
        (acc, permission) => {
            const group = permission.group ?? 'Other';
            acc[group] = acc[group] ?? [];
            acc[group].push(permission);

            return acc;
        },
        {},
    );

    function toggle(id: number) {
        if (selected.includes(id)) {
            onChange(selected.filter((existing) => existing !== id));
        } else {
            onChange([...selected, id]);
        }
    }

    return (
        <div className="space-y-6">
            {Object.entries(groups).map(([group, groupPermissions]) => (
                <div key={group}>
                    <h3 className="mb-2 text-sm font-medium">{group}</h3>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {groupPermissions.map((permission) => (
                            <label
                                key={permission.id}
                                className="flex items-start gap-2 rounded-md border p-2 text-sm"
                            >
                                <input
                                    type="checkbox"
                                    className="mt-0.5 size-4 rounded border-input"
                                    checked={selected.includes(permission.id)}
                                    disabled={disabled}
                                    onChange={() => toggle(permission.id)}
                                />
                                <span>
                                    <span className="block font-medium">
                                        {permission.name}
                                    </span>
                                    <span className="block text-xs text-muted-foreground">
                                        {permission.slug}
                                    </span>
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
