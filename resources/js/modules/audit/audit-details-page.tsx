import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { auditApi } from './api';
import type { AuditLog } from './api';

export default function AuditDetailsPage({
    auditLogId,
}: {
    auditLogId: number;
}) {
    const [item, setItem] = useState<AuditLog>();
    const [error, setError] = useState('');
    useEffect(() => {
        void auditApi
            .show(auditLogId)
            .then((response) => setItem(response.data))
            .catch(() => setError('Unable to load this audit record.'));
    }, [auditLogId]);

    return (
        <main className="mx-auto max-w-4xl p-6">
            <Head title="Audit details" />
            <h1 className="mb-6 text-2xl font-semibold">Audit details</h1>
            {error && <p className="text-destructive">{error}</p>}
            {!item && !error && <p>Loading audit record…</p>}
            {item && (
                <div className="grid gap-4">
                    <section className="rounded-lg border p-4">
                        <strong>{item.action}</strong>
                        <p>
                            {item.entity_type} #{item.entity_id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {item.created_at}
                        </p>
                    </section>
                    {[
                        ['Before', item.before_values],
                        ['After', item.after_values],
                        ['Context', item.context],
                    ].map(([label, value]) => (
                        <section key={label as string}>
                            <h2 className="font-semibold">{label as string}</h2>
                            <pre className="overflow-auto rounded-lg bg-muted p-4 text-xs">
                                {JSON.stringify(value, null, 2)}
                            </pre>
                        </section>
                    ))}
                </div>
            )}
        </main>
    );
}
