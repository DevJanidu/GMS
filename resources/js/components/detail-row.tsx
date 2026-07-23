import type { ReactNode } from 'react';

export function DetailRow({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: string | null;
}) {
    return (
        <div className="flex items-start gap-3 text-sm">
            <span className="mt-0.5 shrink-0 text-muted-foreground">
                {icon}
            </span>
            <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p
                    className={
                        value
                            ? 'break-words text-foreground'
                            : 'italic text-muted-foreground'
                    }
                >
                    {value || 'Not provided'}
                </p>
            </div>
        </div>
    );
}
