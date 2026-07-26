import { CalendarRange } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type DateRange = {
    from: string;
    to: string;
};

type Preset = {
    label: string;
    days: number;
};

const PRESETS: Preset[] = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
];

function toIsoDate(date: Date): string {
    return date.toISOString().slice(0, 10);
}

function presetRange(days: number): DateRange {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);

    return { from: toIsoDate(from), to: toIsoDate(to) };
}

function formatDisplay(range: DateRange): string {
    const from = new Date(`${range.from}T00:00:00`);
    const to = new Date(`${range.to}T00:00:00`);
    const format = (date: Date) =>
        date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

    return `${format(from)} – ${format(to)}`;
}

export function DateRangePicker({
    value,
    onChange,
    className,
}: {
    value: DateRange;
    onChange: (range: DateRange) => void;
    className?: string;
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn('font-normal', className)}
                >
                    <CalendarRange />
                    {formatDisplay(value)}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72">
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                        {PRESETS.map((preset) => (
                            <Button
                                key={preset.label}
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => onChange(presetRange(preset.days))}
                            >
                                {preset.label}
                            </Button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="date-range-from">From</Label>
                            <Input
                                id="date-range-from"
                                type="date"
                                value={value.from}
                                max={value.to}
                                onChange={(event) =>
                                    onChange({ ...value, from: event.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="date-range-to">To</Label>
                            <Input
                                id="date-range-to"
                                type="date"
                                value={value.to}
                                min={value.from}
                                onChange={(event) =>
                                    onChange({ ...value, to: event.target.value })
                                }
                            />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
