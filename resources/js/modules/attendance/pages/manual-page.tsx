import { Head } from '@inertiajs/react';
import { CheckCircle2, Search } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ApiRequestError } from '@/lib/api/client';
import { attendanceApi } from '../api/attendance';
import {
    AttendanceEmpty,
    AttendanceError,
    AttendanceLoading,
} from '../components/attendance-state';
import { OverrideDialog } from '../components/override-dialog';
import type { AttendanceReason, AttendanceResult, SafeMember } from '../types';

export default function ManualPage() {
    const [search, setSearch] = useState('');
    const [members, setMembers] = useState<SafeMember[] | null>(null);
    const [selected, setSelected] = useState<SafeMember | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<AttendanceResult | null>(null);
    const [reason, setReason] = useState<AttendanceReason | null>(null);
    const [overrideOpen, setOverrideOpen] = useState(false);

    async function findMembers() {
        if (search.trim().length < 2) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            setMembers((await attendanceApi.searchMembers(search.trim())).data);
        } catch (caught) {
            setError(
                caught instanceof Error ? caught.message : 'Search failed.',
            );
        } finally {
            setLoading(false);
        }
    }

    async function checkIn(overrideReason?: string) {
        if (!selected) {
            return;
        }

        setLoading(true);
        setError('');
        setReason(null);

        try {
            const response = await attendanceApi.manual({
                member_id: selected.id,
                request_id: crypto.randomUUID(),
                device_id: 'manual-desk',
                override: Boolean(overrideReason),
                override_reason: overrideReason,
            });
            setResult(response.data);
        } catch (caught) {
            if (caught instanceof ApiRequestError) {
                setReason(
                    (caught.errors?.reason_code?.[0] as AttendanceReason) ??
                        'membership_not_active',
                );
                setError(caught.message);
            } else {
                setError('Manual check-in failed.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Head title="Manual check-in" />
            <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 sm:p-6">
                <header>
                    <h1 className="text-2xl font-semibold">Manual check-in</h1>
                    <p className="text-sm text-muted-foreground">
                        Search by member number, name, or phone.
                    </p>
                </header>
                <Card>
                    <CardHeader>
                        <CardTitle>Find member</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            onKeyDown={(event) =>
                                event.key === 'Enter' && void findMembers()
                            }
                            placeholder="Member number or name"
                        />
                        <Button
                            onClick={findMembers}
                            disabled={loading || search.trim().length < 2}
                        >
                            <Search className="size-4" />
                            Search
                        </Button>
                    </CardContent>
                </Card>
                {loading && <AttendanceLoading />}
                {error && <AttendanceError message={error} />}
                {members?.length === 0 && (
                    <AttendanceEmpty message="No members matched this search." />
                )}
                {members && members.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2">
                        {members.map((member) => (
                            <button
                                key={member.id}
                                className={`rounded-xl border p-4 text-left transition ${selected?.id === member.id ? 'border-primary ring-2 ring-primary/20' : 'hover:bg-muted'}`}
                                onClick={() => setSelected(member)}
                            >
                                <strong>{member.display_name}</strong>
                                <p className="text-sm text-muted-foreground">
                                    {member.member_number} · {member.status}
                                </p>
                            </button>
                        ))}
                    </div>
                )}
                {selected && (
                    <Button
                        size="lg"
                        onClick={() => checkIn()}
                        disabled={loading}
                    >
                        Check in {selected.display_name}
                    </Button>
                )}
                {result && (
                    <Alert className="border-emerald-500 bg-emerald-50">
                        <CheckCircle2 />
                        <AlertTitle>Check-in recorded</AlertTitle>
                        <AlertDescription>
                            {result.member.display_name} ·{' '}
                            {result.checked_in_at}
                        </AlertDescription>
                    </Alert>
                )}
            </main>
            <OverrideDialog
                open={overrideOpen}
                reasonCode={reason}
                onClose={() => setOverrideOpen(false)}
                onConfirm={(overrideReason) => {
                    setOverrideOpen(false);
                    void checkIn(overrideReason);
                }}
            />
            {reason && !overrideOpen && (
                <div className="fixed right-4 bottom-4">
                    <Button
                        variant="destructive"
                        onClick={() => setOverrideOpen(true)}
                    >
                        Review manager override
                    </Button>
                </div>
            )}
        </>
    );
}
