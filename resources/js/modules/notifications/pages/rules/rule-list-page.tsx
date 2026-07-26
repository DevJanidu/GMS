import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { notificationAdminApi } from '../../api';
import type { NotificationRule } from '../../api';

export default function RuleListPage() {
    const [items, setItems] = useState<NotificationRule[]>([]);
    const [error, setError] = useState('');
    useEffect(() => {
        void notificationAdminApi
            .rules()
            .then((result) => setItems(result.data))
            .catch(() => setError('Unable to load notification rules.'));
    }, []);

    return (
        <main className="mx-auto max-w-6xl p-6">
            <Head title="Notification rules" />
            <h1 className="text-2xl font-semibold">Notification rules</h1>
            <p className="mb-6 text-sm text-muted-foreground">
                Event-driven channel and template mappings.
            </p>
            {error && <p className="text-destructive">{error}</p>}
            {!error && items.length === 0 && (
                <p className="rounded-lg border p-6">No rules configured.</p>
            )}
            <div className="grid gap-3">
                {items.map((item) => (
                    <article key={item.id} className="rounded-lg border p-4">
                        <strong>{item.name}</strong>
                        <p className="text-sm text-muted-foreground">
                            {item.event_type} → {item.channel} · {item.status}
                        </p>
                    </article>
                ))}
            </div>
        </main>
    );
}
