import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DAYS_OF_WEEK } from '../types';
import type { OpeningHours } from '../types';

type OpeningHoursEditorProps = {
    value: OpeningHours;
    onChange: (value: OpeningHours) => void;
    onSave: () => void;
    saving: boolean;
};

function capitalize(day: string): string {
    return day.charAt(0).toUpperCase() + day.slice(1);
}

export function OpeningHoursEditor({
    value,
    onChange,
    onSave,
    saving,
}: OpeningHoursEditorProps) {
    function setDay(day: string, patch: Partial<OpeningHours[string]>) {
        onChange({
            ...value,
            [day]: { ...value[day], ...patch },
        });
    }

    return (
        <div className="space-y-4">
            {DAYS_OF_WEEK.map((day) => {
                const dayValue = value[day] ?? {};
                const closed = dayValue.closed ?? false;

                return (
                    <div
                        key={day}
                        className="grid grid-cols-1 items-center gap-3 rounded-lg border p-3 sm:grid-cols-[8rem_1fr_1fr_auto]"
                    >
                        <span className="font-medium">{capitalize(day)}</span>

                        <div className="grid gap-1">
                            <Label
                                htmlFor={`${day}-open`}
                                className="text-xs text-muted-foreground"
                            >
                                Opens
                            </Label>
                            <Input
                                id={`${day}-open`}
                                type="time"
                                disabled={closed}
                                value={dayValue.open ?? ''}
                                onChange={(e) =>
                                    setDay(day, { open: e.target.value })
                                }
                            />
                        </div>

                        <div className="grid gap-1">
                            <Label
                                htmlFor={`${day}-close`}
                                className="text-xs text-muted-foreground"
                            >
                                Closes
                            </Label>
                            <Input
                                id={`${day}-close`}
                                type="time"
                                disabled={closed}
                                value={dayValue.close ?? ''}
                                onChange={(e) =>
                                    setDay(day, { close: e.target.value })
                                }
                            />
                        </div>

                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={closed}
                                onChange={(e) =>
                                    setDay(day, { closed: e.target.checked })
                                }
                                className="size-4 rounded border-input"
                            />
                            Closed
                        </label>
                    </div>
                );
            })}

            <Button onClick={onSave} disabled={saving}>
                Save opening hours
            </Button>
        </div>
    );
}
