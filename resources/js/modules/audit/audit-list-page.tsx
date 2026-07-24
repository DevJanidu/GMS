import { Head, Link } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { auditApi } from './api';
import type { AuditLog } from './api';

export default function AuditListPage() {
    const [items, setItems] = useState<AuditLog[]>([]);
    const [action, setAction] = useState('');
    const [error, setError] = useState('');
    const load = (query = '') => {
        void auditApi
            .list(query)
            .then((response) => setItems(response.data))
            .catch(() => setError('Unable to load audit logs.'));
    };
    useEffect(load, []);

    const filter = (event: FormEvent) => {
        event.preventDefault();
        load(action ? `?action=${encodeURIComponent(action)}` : '');
    };

    return (
        <main className="mx-auto max-w-6xl p-6">
            <Head title="Audit logs" />
            <h1 className="text-2xl font-semibold">Audit logs</h1>
            <p className="mb-6 text-sm text-muted-foreground">
                Append-only administrative activity.
            </p>
            <form onSubmit={filter} className="mb-6 flex gap-2">
                <input
                    aria-label="Action filter"
                    className="rounded-md border p-2"
                    placeholder="Action prefix"
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                />
                <button className="rounded-md border px-4">Filter</button>
            </form>
            {error && <p className="text-destructive">{error}</p>}
            {!error && items.length === 0 && <p>No audit records found.</p>}
            <div className="grid gap-2">
                {items.map((item) => (
                    <Link
                        key={item.id}
                        href={`/audit/${item.id}`}
                        className="rounded-lg border p-4 hover:bg-muted"
                    >
                        <strong>{item.action}</strong>
                        <p className="text-sm text-muted-foreground">
                            {item.actor?.name ?? 'System'} · {item.entity_type}{' '}
                            #{item.entity_id}
                        </p>
                    </Link>
                ))}
            </div>
        </main>
    );
}
