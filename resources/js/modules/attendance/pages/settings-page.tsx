import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { attendanceApi } from '../api/attendance';
import {
    AttendanceError,
    AttendanceLoading,
} from '../components/attendance-state';
import type { AttendanceSettings } from '../types';

export default function SettingsPage() {
    const [settings, setSettings] = useState<AttendanceSettings | null>(null);
    const [error, setError] = useState('');
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        attendanceApi
            .settings()
            .then(({ data }) => setSettings(data))
            .catch((caught) =>
                setError(
                    caught instanceof Error
                        ? caught.message
                        : 'Settings failed.',
                ),
            );
    }, []);

    function update<K extends keyof AttendanceSettings>(
        key: K,
        value: AttendanceSettings[K],
    ) {
        setSettings((current) =>
            current ? { ...current, [key]: value } : current,
        );
        setSaved(false);
    }

    async function save() {
        if (!settings) {
            return;
        }

        setSaving(true);
        setError('');

        try {
            setSettings(
                (
                    await attendanceApi.updateSettings({
                        mode: settings.mode,
                        duplicate_window_seconds:
                            settings.duplicate_window_seconds,
                        allow_manual_entry: settings.allow_manual_entry,
                        manager_override_required:
                            settings.manager_override_required,
                        visit_limit_rules: settings.visit_limit_rules,
                    })
                ).data,
            );
            setSaved(true);
        } catch (caught) {
            setError(
                caught instanceof Error
                    ? caught.message
                    : 'Settings could not be saved.',
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <Head title="Attendance settings" />
            <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 sm:p-6">
                <header>
                    <h1 className="text-2xl font-semibold">
                        Attendance settings
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Settings apply only to the currently selected branch.
                    </p>
                </header>
                {!settings && !error && <AttendanceLoading />}
                {error && <AttendanceError message={error} />}
                {settings && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Branch attendance behavior</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="mode">Attendance mode</Label>
                                <Select
                                    value={settings.mode}
                                    onValueChange={(
                                        value: AttendanceSettings['mode'],
                                    ) => update('mode', value)}
                                >
                                    <SelectTrigger id="mode">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="check_in_only">
                                            Check-in only
                                        </SelectItem>
                                        <SelectItem value="check_in_out">
                                            Check-in and check-out
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <NumberSetting
                                id="duplicate-window"
                                label="Duplicate window (seconds)"
                                value={settings.duplicate_window_seconds}
                                min={5}
                                max={3600}
                                onChange={(value) =>
                                    update('duplicate_window_seconds', value)
                                }
                            />
                            <ToggleSetting
                                label="Allow manual entry"
                                checked={settings.allow_manual_entry}
                                onChange={(checked) =>
                                    update('allow_manual_entry', checked)
                                }
                            />
                            <ToggleSetting
                                label="Require manager-controlled overrides"
                                checked={settings.manager_override_required}
                                onChange={(checked) =>
                                    update('manager_override_required', checked)
                                }
                            />
                            <div className="grid gap-3 border-t pt-5 sm:grid-cols-3">
                                {(['day', 'week', 'month'] as const).map(
                                    (period) => (
                                        <NumberSetting
                                            key={period}
                                            id={`visits-${period}`}
                                            label={`Visits per ${period}`}
                                            value={
                                                settings.visit_limit_rules[
                                                    `visits_per_${period}`
                                                ] ?? 0
                                            }
                                            min={0}
                                            max={
                                                period === 'day'
                                                    ? 100
                                                    : period === 'week'
                                                      ? 700
                                                      : 3100
                                            }
                                            onChange={(value) =>
                                                update('visit_limit_rules', {
                                                    ...settings.visit_limit_rules,
                                                    [`visits_per_${period}`]:
                                                        value || undefined,
                                                })
                                            }
                                        />
                                    ),
                                )}
                            </div>
                            <div className="flex items-center justify-end gap-3">
                                {saved && (
                                    <span className="text-sm text-emerald-700">
                                        Saved
                                    </span>
                                )}
                                <Button onClick={save} disabled={saving}>
                                    Save settings
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
        </>
    );
}

function ToggleSetting({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
            <Label>{label}</Label>
            <Switch checked={checked} onCheckedChange={onChange} />
        </div>
    );
}

function NumberSetting({
    id,
    label,
    value,
    min,
    max,
    onChange,
}: {
    id: string;
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                type="number"
                value={value}
                min={min}
                max={max}
                onChange={(event) => onChange(Number(event.target.value))}
            />
        </div>
    );
}
