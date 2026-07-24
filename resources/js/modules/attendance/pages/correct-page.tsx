import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { attendanceApi } from '../api/attendance';
import {
    AttendanceError,
    AttendanceLoading,
} from '../components/attendance-state';
import type { AttendanceRecord } from '../types';

export default function CorrectPage({
    attendanceRecordId,
}: {
    attendanceRecordId: number;
}) {
    const [record, setRecord] = useState<AttendanceRecord | null>(null);
    const [checkedInAt, setCheckedInAt] = useState('');
    const [checkedOutAt, setCheckedOutAt] = useState('');
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        attendanceApi
            .record(attendanceRecordId)
            .then(({ data }) => {
                setRecord(data);
                setCheckedInAt(toLocalInput(data.checked_in_at));
                setCheckedOutAt(
                    data.checked_out_at
                        ? toLocalInput(data.checked_out_at)
                        : '',
                );
            })
            .catch((caught) =>
                setError(
                    caught instanceof Error ? caught.message : 'Load failed.',
                ),
            );
    }, [attendanceRecordId]);

    async function save() {
        setSaving(true);
        setError('');

        try {
            await attendanceApi.correct(attendanceRecordId, {
                request_id: crypto.randomUUID(),
                reason,
                checked_in_at: new Date(checkedInAt).toISOString(),
                checked_out_at: checkedOutAt
                    ? new Date(checkedOutAt).toISOString()
                    : null,
            });
            window.location.assign(`/attendance/records/${attendanceRecordId}`);
        } catch (caught) {
            setError(
                caught instanceof Error ? caught.message : 'Correction failed.',
            );
            setSaving(false);
        }
    }

    async function reverse() {
        if (reason.trim().length < 3) {
            return;
        }

        setSaving(true);

        try {
            await attendanceApi.reverse(
                attendanceRecordId,
                crypto.randomUUID(),
                reason,
            );
            window.location.assign(`/attendance/records/${attendanceRecordId}`);
        } catch (caught) {
            setError(
                caught instanceof Error ? caught.message : 'Reversal failed.',
            );
            setSaving(false);
        }
    }

    return (
        <>
            <Head title="Correct attendance" />
            <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 sm:p-6">
                <header>
                    <h1 className="text-2xl font-semibold">
                        Correct attendance
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        The original values remain in append-only correction
                        history.
                    </p>
                </header>
                {!record && !error && <AttendanceLoading />}
                {error && <AttendanceError message={error} />}
                {record && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{record.member.display_name}</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="checked-in">Check-in</Label>
                                <Input
                                    id="checked-in"
                                    type="datetime-local"
                                    value={checkedInAt}
                                    onChange={(e) =>
                                        setCheckedInAt(e.target.value)
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="checked-out">Check-out</Label>
                                <Input
                                    id="checked-out"
                                    type="datetime-local"
                                    value={checkedOutAt}
                                    onChange={(e) =>
                                        setCheckedOutAt(e.target.value)
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="reason">Mandatory reason</Label>
                                <Textarea
                                    id="reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    maxLength={500}
                                />
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                <Button
                                    variant="destructive"
                                    disabled={
                                        saving || reason.trim().length < 3
                                    }
                                    onClick={reverse}
                                >
                                    Reverse attendance
                                </Button>
                                <Button
                                    disabled={
                                        saving ||
                                        reason.trim().length < 3 ||
                                        !checkedInAt
                                    }
                                    onClick={save}
                                >
                                    Save correction
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
        </>
    );
}

function toLocalInput(value: string): string {
    const date = new Date(value);
    const offset = date.getTimezoneOffset() * 60_000;

    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}
