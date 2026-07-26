import type { Branch } from '@/modules/branches/types';

type BranchPickerProps = {
    branches: Branch[];
    selected: number[];
    primary: number | null;
    onChange: (selected: number[], primary: number | null) => void;
};

export function BranchPicker({
    branches,
    selected,
    primary,
    onChange,
}: BranchPickerProps) {
    function toggle(id: number) {
        if (selected.includes(id)) {
            const next = selected.filter((existing) => existing !== id);
            onChange(next, primary === id ? (next[0] ?? null) : primary);
        } else {
            const next = [...selected, id];
            onChange(next, primary ?? id);
        }
    }

    return (
        <div className="space-y-2">
            {branches.map((branch) => (
                <label
                    key={branch.id}
                    className="flex items-center justify-between gap-3 rounded-md border p-2 text-sm"
                >
                    <span className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            className="size-4 rounded border-input"
                            checked={selected.includes(branch.id)}
                            onChange={() => toggle(branch.id)}
                        />
                        {branch.name}
                        <span className="text-xs text-muted-foreground">
                            {branch.code}
                        </span>
                    </span>

                    {selected.includes(branch.id) && (
                        <label className="flex items-center gap-1 text-xs text-muted-foreground">
                            <input
                                type="radio"
                                name="primary_branch"
                                checked={primary === branch.id}
                                onChange={() => onChange(selected, branch.id)}
                            />
                            Primary
                        </label>
                    )}
                </label>
            ))}
        </div>
    );
}
