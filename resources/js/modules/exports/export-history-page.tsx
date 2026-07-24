import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { exportsApi } from './api';
import type { ReportExport } from './api';

export default function ExportHistoryPage() {
    const [items, setItems] = useState<ReportExport[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const fetchList = useCallback(() => {
        return exportsApi
            .list()
            .then((response) => setItems(response.data))
            .catch(() => setError('Unable to load export history.'))
            .finally(() => setLoading(false));
    }, []);
    const reload = useCallback(() => {
        setLoading(true);
        void fetchList();
    }, [fetchList]);
    useEffect(() => {
        void fetchList();
    }, [fetchList]);

    return (
        <main className="mx-auto max-w-6xl p-6">
            <Head title="Export history" />
            <h1 className="mb-6 text-2xl font-semibold">Export history</h1>
            {loading && <p>Loading exports…</p>}
            {error && <p className="text-destructive">{error}</p>}
            {!loading && !error && items.length === 0 && (
                <p className="rounded-lg border p-6">No exports requested.</p>
            )}
            <div className="grid gap-3">
                {items.map((item) => (
                    <article
                        key={item.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
                    >
                        <div>
                            <strong>{item.report_key}</strong>
                            <p className="text-sm text-muted-foreground">
                                {item.status} · {item.row_count ?? '—'} rows
                            </p>
                        </div>
                        {item.status === 'completed' && (
                            <a
                                href={exportsApi.downloadUrl(item.id)}
                                className="text-primary underline"
                            >
                                Download CSV
                            </a>
                        )}
                        {item.status === 'failed' && (
                            <button
                                className="text-primary underline"
                                onClick={() =>
                                    void exportsApi.retry(item.id).then(reload)
                                }
                            >
                                Retry
                            </button>
                        )}
                    </article>
                ))}
            </div>
        </main>
    );
}
