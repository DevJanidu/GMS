import { Head } from '@inertiajs/react';
import { LogOut, RefreshCw, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { attendanceApi } from '../api/attendance';
import {
    AttendanceEmpty,
    AttendanceError,
    AttendanceLoading,
} from '../components/attendance-state';
import type { LiveAttendance } from '../types';

export default function LivePage() {
    const [data, setData] = useState<LiveAttendance | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        setError('');

        try {
            setData((await attendanceApi.live()).data);
        } catch (caught) {
            setError(
                caught instanceof Error
                    ? caught.message
                    : 'Live attendance failed.',
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const initialLoad = window.setTimeout(() => void load(), 0);
        const timer = window.setInterval(load, 15_000);

        return () => {
            window.clearTimeout(initialLoad);
            window.clearInterval(timer);
        };
    }, [load]);

    async function checkout(id: number) {
        await attendanceApi.checkout(
            id,
            crypto.randomUUID(),
            'Staff check-out',
        );
        await load();
    }

    return (
        <>
            <Head title="Live attendance" />
            <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
                <header className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Live attendance
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Automatically refreshes every 15 seconds.
                        </p>
                    </div>
                    <Button variant="outline" onClick={load}>
                        <RefreshCw className="size-4" />
                        Refresh
                    </Button>
                </header>
                {loading && <AttendanceLoading />}
                {error && <AttendanceError message={error} retry={load} />}
                {data && (
                    <>
                        <Card>
                            <CardHeader className="flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="size-5" />
                                    Present members
                                </CardTitle>
                                <Badge variant="secondary" className="text-lg">
                                    {data.count}
                                </Badge>
                            </CardHeader>
                        </Card>
                        {data.truncated && (
                            <p className="text-sm text-muted-foreground">
                                Showing the 100 most recent present members.
                            </p>
                        )}
                        {data.records.length === 0 ? (
                            <AttendanceEmpty message="No members are currently present." />
                        ) : (
                            <div className="grid gap-3 md:grid-cols-2">
                                {data.records.map((record) => (
                                    <Card key={record.id}>
                                        <CardContent className="flex items-center justify-between gap-4 p-4">
                                            <div>
                                                <strong>
                                                    {record.member.display_name}
                                                </strong>
                                                <p className="text-sm text-muted-foreground">
                                                    {
                                                        record.member
                                                            .member_number
                                                    }{' '}
                                                    ·{' '}
                                                    {new Date(
                                                        record.checked_in_at,
                                                    ).toLocaleTimeString()}
                                                </p>
                                            </div>
                                            {data.mode === 'check_in_out' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        checkout(record.id)
                                                    }
                                                >
                                                    <LogOut className="size-4" />
                                                    Check out
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>
        </>
    );
}
