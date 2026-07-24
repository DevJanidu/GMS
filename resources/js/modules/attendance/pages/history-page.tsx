import { Head } from '@inertiajs/react';
import { Eye, Filter } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { attendanceApi } from '../api/attendance';
import type { Page } from '../api/attendance';
import {
    AttendanceEmpty,
    AttendanceError,
    AttendanceLoading,
} from '../components/attendance-state';
import type { AttendanceRecord } from '../types';

export default function HistoryPage() {
    const [page, setPage] = useState<Page<AttendanceRecord> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [status, setStatus] = useState('all');

    const load = useCallback(
        async (targetPage = 1) => {
            setLoading(true);
            setError('');
            const query = new URLSearchParams({
                page: String(targetPage),
                per_page: '20',
            });

            if (dateFrom) {
                query.set('date_from', dateFrom);
            }

            if (dateTo) {
                query.set('date_to', dateTo);
            }

            if (status !== 'all') {
                query.set('status', status);
            }

            try {
                setPage(await attendanceApi.records(query.toString()));
            } catch (caught) {
                setError(
                    caught instanceof Error
                        ? caught.message
                        : 'History could not be loaded.',
                );
            } finally {
                setLoading(false);
            }
        },
        [dateFrom, dateTo, status],
    );

    useEffect(() => {
        const timer = window.setTimeout(() => void load(), 0);

        return () => window.clearTimeout(timer);
    }, [load]);

    return (
        <>
            <Head title="Attendance history" />
            <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6">
                <header>
                    <h1 className="text-2xl font-semibold">
                        Attendance history
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Branch-scoped, auditable attendance records.
                    </p>
                </header>
                <section className="grid gap-3 rounded-xl border p-4 sm:grid-cols-4">
                    <Input
                        aria-label="Date from"
                        type="date"
                        value={dateFrom}
                        onChange={(event) => setDateFrom(event.target.value)}
                    />
                    <Input
                        aria-label="Date to"
                        type="date"
                        value={dateTo}
                        onChange={(event) => setDateTo(event.target.value)}
                    />
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger aria-label="Status">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="checked_in">
                                Checked in
                            </SelectItem>
                            <SelectItem value="checked_out">
                                Checked out
                            </SelectItem>
                            <SelectItem value="reversed">Reversed</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={() => load()}>
                        <Filter className="size-4" />
                        Apply filters
                    </Button>
                </section>
                {loading && <AttendanceLoading />}
                {error && <AttendanceError message={error} retry={load} />}
                {page?.data.length === 0 && (
                    <AttendanceEmpty message="No attendance records match these filters." />
                )}
                {page && page.data.length > 0 && (
                    <>
                        <div className="overflow-x-auto rounded-xl border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Member</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Source</TableHead>
                                        <TableHead>Check-in</TableHead>
                                        <TableHead>Check-out</TableHead>
                                        <TableHead />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {page.data.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell>
                                                <strong>
                                                    {record.member.display_name}
                                                </strong>
                                                <div className="text-xs text-muted-foreground">
                                                    {
                                                        record.member
                                                            .member_number
                                                    }
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {record.status.replaceAll(
                                                        '_',
                                                        ' ',
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {record.source.replaceAll(
                                                    '_',
                                                    ' ',
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    record.checked_in_at,
                                                ).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                {record.checked_out_at
                                                    ? new Date(
                                                          record.checked_out_at,
                                                      ).toLocaleString()
                                                    : '—'}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    asChild
                                                    size="icon"
                                                    variant="ghost"
                                                >
                                                    <a
                                                        href={`/attendance/records/${record.id}`}
                                                        aria-label="View attendance"
                                                    >
                                                        <Eye className="size-4" />
                                                    </a>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Page {page.meta.current_page} of{' '}
                                {page.meta.last_page}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    disabled={page.meta.current_page <= 1}
                                    onClick={() =>
                                        load(page.meta.current_page - 1)
                                    }
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    disabled={
                                        page.meta.current_page >=
                                        page.meta.last_page
                                    }
                                    onClick={() =>
                                        load(page.meta.current_page + 1)
                                    }
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </>
    );
}
