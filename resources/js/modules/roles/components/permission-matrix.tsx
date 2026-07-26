import { ChevronRight, SearchIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
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
    const [search, setSearch] = useState('');
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    const groups = useMemo(() => {
        const query = search.trim().toLowerCase();

        return permissions.reduce<Record<string, Permission[]>>(
            (acc, permission) => {
                const group = permission.group ?? 'Other';
                const matchesSearch =
                    query === '' ||
                    permission.name.toLowerCase().includes(query) ||
                    permission.slug.toLowerCase().includes(query) ||
                    group.toLowerCase().includes(query);

                if (!matchesSearch) {
                    return acc;
                }

                acc[group] = acc[group] ?? [];
                acc[group].push(permission);

                return acc;
            },
            {},
        );
    }, [permissions, search]);

    const searching = search.trim() !== '';

    function toggle(id: number) {
        if (selected.includes(id)) {
            onChange(selected.filter((existing) => existing !== id));
        } else {
            onChange([...selected, id]);
        }
    }

    function toggleGroup(groupPermissions: Permission[], checked: boolean) {
        const ids = groupPermissions.map((permission) => permission.id);

        if (checked) {
            onChange([...new Set([...selected, ...ids])]);
        } else {
            onChange(selected.filter((id) => !ids.includes(id)));
        }
    }

    function isGroupOpen(group: string) {
        return searching || (openGroups[group] ?? false);
    }

    function setAllGroups(open: boolean) {
        setOpenGroups(
            Object.fromEntries(
                Object.keys(groups).map((group) => [group, open]),
            ),
        );
    }

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative max-w-sm flex-1">
                    <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search permissions"
                        className="pl-8"
                    />
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => setAllGroups(true)}
                    >
                        Expand all
                    </button>
                    <span className="text-muted-foreground">·</span>
                    <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => setAllGroups(false)}
                    >
                        Collapse all
                    </button>
                </div>
                <p className="ml-auto text-sm text-muted-foreground">
                    {selected.length} of {permissions.length} permissions
                    selected
                </p>
            </div>

            {Object.keys(groups).length === 0 && (
                <p className="rounded-lg border p-4 text-sm text-muted-foreground">
                    No permissions match “{search}”.
                </p>
            )}

            <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-2">
                {Object.entries(groups).map(([group, groupPermissions]) => {
                    const groupIds = groupPermissions.map((p) => p.id);
                    const selectedInGroup = groupIds.filter((id) =>
                        selected.includes(id),
                    ).length;
                    const allSelected = selectedInGroup === groupIds.length;
                    const open = isGroupOpen(group);

                    return (
                        <Collapsible
                            key={group}
                            open={open}
                            onOpenChange={(next) =>
                                setOpenGroups((current) => ({
                                    ...current,
                                    [group]: next,
                                }))
                            }
                            className="rounded-lg border"
                        >
                            <div className="flex items-center gap-2 p-3">
                                <Checkbox
                                    aria-label={`Select all ${group} permissions`}
                                    checked={
                                        allSelected
                                            ? true
                                            : selectedInGroup > 0
                                              ? 'indeterminate'
                                              : false
                                    }
                                    disabled={disabled}
                                    onCheckedChange={(checked) =>
                                        toggleGroup(
                                            groupPermissions,
                                            checked === true,
                                        )
                                    }
                                />
                                <CollapsibleTrigger asChild>
                                    <button
                                        type="button"
                                        className="group/trigger flex flex-1 items-center gap-2 text-left text-sm font-medium"
                                    >
                                        <ChevronRight className="size-4 text-muted-foreground transition-transform group-data-[state=open]/trigger:rotate-90" />
                                        {group}
                                        <span className="font-normal text-muted-foreground">
                                            ({selectedInGroup}/
                                            {groupIds.length})
                                        </span>
                                    </button>
                                </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent>
                                <div className="grid grid-cols-1 gap-2 border-t p-3 sm:grid-cols-2">
                                    {groupPermissions.map((permission) => (
                                        <label
                                            key={permission.id}
                                            className="flex items-start gap-2 rounded-md border p-2 text-sm"
                                        >
                                            <Checkbox
                                                aria-label={permission.name}
                                                className="mt-0.5"
                                                checked={selected.includes(
                                                    permission.id,
                                                )}
                                                disabled={disabled}
                                                onCheckedChange={() =>
                                                    toggle(permission.id)
                                                }
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
                            </CollapsibleContent>
                        </Collapsible>
                    );
                })}
            </div>
        </div>
    );
}
