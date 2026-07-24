import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { notificationAdminApi } from '../../api';
import type { NotificationTemplate } from '../../api';

export default function TemplateListPage() {
    const [items, setItems] = useState<NotificationTemplate[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        void notificationAdminApi
            .templates()
            .then((response) => setItems(response.data))
            .catch(() => setError('Unable to load notification templates.'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
            <Head title="Notification templates" />
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Notification templates
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage safe, channel-specific message templates.
                    </p>
                </div>
                <Link
                    href="/notifications/templates/create"
                    className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
                >
                    Create template
                </Link>
            </header>
            {loading && <p>Loading templates…</p>}
            {error && (
                <p role="alert" className="text-destructive">
                    {error}
                </p>
            )}
            {!loading && !error && items.length === 0 && (
                <p className="rounded-lg border p-6">No templates yet.</p>
            )}
            <div className="grid gap-3">
                {items.map((item) => (
                    <Link
                        key={item.id}
                        href={`/notifications/templates/${item.id}/edit`}
                        className="rounded-lg border p-4 hover:bg-muted"
                    >
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                            {item.channel} · {item.key} · {item.status}
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}
