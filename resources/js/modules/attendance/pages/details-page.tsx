import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { attendanceApi } from '../api/attendance';
import {
    AttendanceError,
    AttendanceLoading,
} from '../components/attendance-state';
import type { AttendanceRecord } from '../types';

export default function DetailsPage({
    attendanceRecordId,
}: {
    attendanceRecordId: number;
}) {
    const [record, setRecord] = useState<AttendanceRecord | null>(null);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        setError('');

        try {
            setRecord((await attendanceApi.record(attendanceRecordId)).data);
        } catch (caught) {
            setError(
                caught instanceof Error
                    ? caught.message
                    : 'Attendance detail failed.',
            );
        }
    }, [attendanceRecordId]);

    useEffect(() => {
        const timer = window.setTimeout(() => void load(), 0);

        return () => window.clearTimeout(timer);
    }, [load]);

    return (
        <>
            <Head title="Attendance details" />
            <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 sm:p-6">
                <header className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Attendance details
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Immutable attribution and correction history.
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <a
                            href={`/attendance/records/${attendanceRecordId}/correct`}
                        >
                            Correct or reverse
                        </a>
                    </Button>
                </header>
                {!record && !error && <AttendanceLoading />}
                {error && <AttendanceError message={error} retry={load} />}
                {record && (
                    <>
                        <Card>
                            <CardHeader className="flex-row items-center justify-between">
                                <CardTitle>
                                    {record.member.display_name}
                                </CardTitle>
                                <Badge>
                                    {record.status.replaceAll('_', ' ')}
                                </Badge>
                            </CardHeader>
                            <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
                                <Detail
                                    label="Member number"
                                    value={record.member.member_number}
                                />
                                <Detail
                                    label="Branch"
                                    value={record.branch.name}
                                />
                                <Detail
                                    label="Check-in"
                                    value={new Date(
                                        record.checked_in_at,
                                    ).toLocaleString()}
                                />
                                <Detail
                                    label="Check-out"
                                    value={
                                        record.checked_out_at
                                            ? new Date(
                                                  record.checked_out_at,
                                              ).toLocaleString()
                                            : 'Not checked out'
                                    }
                                />
                                <Detail
                                    label="Source"
                                    value={record.source.replaceAll('_', ' ')}
                                />
                                <Detail
                                    label="Device"
                                    value={record.device_id ?? 'Not supplied'}
                                />
                                <Detail
                                    label="Recorded by"
                                    value={record.recorded_by?.name ?? 'System'}
                                />
                                <Detail
                                    label="Override"
                                    value={record.override?.reason ?? 'None'}
                                />
                            </CardContent>
                        </Card>
                        <section className="space-y-3">
                            <h2 className="text-lg font-semibold">
                                Correction history
                            </h2>
                            {record.corrections.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No corrections recorded.
                                </p>
                            ) : (
                                record.corrections.map((correction) => (
                                    <Card key={correction.id}>
                                        <CardContent className="p-4 text-sm">
                                            <strong className="capitalize">
                                                {correction.type}
                                            </strong>
                                            <p>{correction.reason}</p>
                                            <p className="text-muted-foreground">
                                                {new Date(
                                                    correction.corrected_at,
                                                ).toLocaleString()}{' '}
                                                ·{' '}
                                                {correction.corrected_by
                                                    ?.name ?? 'System'}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </section>
                    </>
                )}
            </main>
        </>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-medium">{value}</dd>
        </div>
    );
}
