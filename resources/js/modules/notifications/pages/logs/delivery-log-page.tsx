import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { notificationAdminApi } from '../../api';
import type { NotificationDelivery } from '../../api';

export default function DeliveryLogPage() {
    const [items, setItems] = useState<NotificationDelivery[]>([]);
    const [error, setError] = useState('');
    const load = useCallback(() => {
        void notificationAdminApi
            .deliveries('?per_page=100')
            .then((result) => setItems(result.data))
            .catch(() => setError('Unable to load delivery logs.'));
    }, []);
    useEffect(load, [load]);

    return (
        <main className="mx-auto max-w-6xl p-6">
            <Head title="Notification delivery logs" />
            <h1 className="mb-6 text-2xl font-semibold">Delivery logs</h1>
            {error && <p className="text-destructive">{error}</p>}
            <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b text-left">
                            <th className="p-3">Channel</th>
                            <th className="p-3">Recipient</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Attempts</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id} className="border-b">
                                <td className="p-3">{item.channel}</td>
                                <td className="p-3">{item.recipient}</td>
                                <td className="p-3">{item.status}</td>
                                <td className="p-3">{item.attempt_count}</td>
                                <td className="p-3">
                                    {item.status === 'failed' && (
                                        <button
                                            className="text-primary underline"
                                            onClick={() =>
                                                void notificationAdminApi
                                                    .retryDelivery(item.id)
                                                    .then(load)
                                            }
                                        >
                                            Retry
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
