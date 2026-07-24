import { Head } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { notificationAdminApi } from '../../api';
import type { Announcement, NotificationTemplate } from '../../api';

export default function AnnouncementPage() {
    const [items, setItems] = useState<Announcement[]>([]);
    const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [templateId, setTemplateId] = useState(0);
    const [error, setError] = useState('');
    const load = useCallback(() => {
        void Promise.all([
            notificationAdminApi.announcements(),
            notificationAdminApi.templates(),
        ])
            .then(([announcements, availableTemplates]) => {
                setItems(announcements.data);
                setTemplates(availableTemplates.data);
                setTemplateId(
                    (current) => current || availableTemplates.data[0]?.id || 0,
                );
            })
            .catch(() => setError('Unable to load announcements.'));
    }, []);
    useEffect(load, [load]);

    const submit = (event: FormEvent) => {
        event.preventDefault();
        setError('');
        void notificationAdminApi
            .createAnnouncement({
                template_id: templateId,
                title,
                message,
                channels: ['in_app'],
                audience_filters: { member_status: 'active' },
            })
            .then(() => {
                setTitle('');
                setMessage('');
                load();
            })
            .catch(() => setError('Unable to create the announcement.'));
    };

    return (
        <main className="mx-auto grid max-w-6xl gap-8 p-6 lg:grid-cols-2">
            <Head title="Manual announcements" />
            <section>
                <h1 className="mb-4 text-2xl font-semibold">
                    Manual announcement
                </h1>
                <form onSubmit={submit} className="grid gap-3">
                    <select
                        className="rounded-md border p-2"
                        aria-label="Template"
                        value={templateId}
                        onChange={(e) => setTemplateId(Number(e.target.value))}
                    >
                        {templates.map((template) => (
                            <option key={template.id} value={template.id}>
                                {template.name}
                            </option>
                        ))}
                    </select>
                    <input
                        required
                        className="rounded-md border p-2"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        required
                        className="min-h-32 rounded-md border p-2"
                        placeholder="Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
                        Save draft
                    </button>
                </form>
                {error && <p className="mt-3 text-destructive">{error}</p>}
            </section>
            <section>
                <h2 className="mb-4 text-xl font-semibold">Announcements</h2>
                <div className="grid gap-3">
                    {items.length === 0 && <p>No announcements yet.</p>}
                    {items.map((item) => (
                        <article
                            key={item.id}
                            className="rounded-lg border p-4"
                        >
                            <strong>{item.title}</strong>
                            <p className="text-sm">{item.status}</p>
                            {item.status === 'draft' && (
                                <button
                                    className="mt-2 text-primary underline"
                                    onClick={() =>
                                        void notificationAdminApi
                                            .scheduleAnnouncement(item.id)
                                            .then(load)
                                    }
                                >
                                    Dispatch now
                                </button>
                            )}
                            {item.status === 'scheduled' && (
                                <button
                                    className="mt-2 text-destructive underline"
                                    onClick={() =>
                                        void notificationAdminApi
                                            .cancelAnnouncement(item.id)
                                            .then(load)
                                    }
                                >
                                    Cancel
                                </button>
                            )}
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
