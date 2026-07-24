import { Head, router } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { notificationAdminApi } from '../../api';
import type { NotificationTemplate } from '../../api';

const empty: Omit<NotificationTemplate, 'id' | 'branch_id'> = {
    name: '',
    key: '',
    channel: 'in_app',
    locale: 'en',
    subject: '',
    body: '',
    variables: [],
    status: 'active',
};

export default function TemplateFormPage({
    templateId,
}: {
    templateId?: number;
}) {
    const [form, setForm] = useState(empty);
    const [variables, setVariables] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!templateId) {
            return;
        }

        void notificationAdminApi
            .template(templateId)
            .then(({ data }) => {
                setForm({
                    name: data.name,
                    key: data.key,
                    channel: data.channel,
                    locale: data.locale,
                    subject: data.subject,
                    body: data.body,
                    variables: data.variables,
                    status: data.status,
                });
                setVariables(data.variables.join(', '));
            })
            .catch(() => setError('Unable to load this template.'));
    }, [templateId]);

    const submit = (event: FormEvent) => {
        event.preventDefault();
        setSaving(true);
        setError('');
        const input = {
            ...form,
            variables: variables
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean),
        };
        const request = templateId
            ? notificationAdminApi.updateTemplate(templateId, input)
            : notificationAdminApi.createTemplate(input);
        void request
            .then(() => router.visit('/notifications/templates'))
            .catch(() => setError('Template validation failed.'))
            .finally(() => setSaving(false));
    };

    const field = (name: keyof typeof form, value: string) =>
        setForm((current) => ({ ...current, [name]: value }));

    return (
        <main className="mx-auto max-w-3xl p-6">
            <Head title={templateId ? 'Edit template' : 'Create template'} />
            <h1 className="mb-6 text-2xl font-semibold">
                {templateId ? 'Edit template' : 'Create template'}
            </h1>
            <form onSubmit={submit} className="grid gap-4">
                <input
                    required
                    aria-label="Template name"
                    className="rounded-md border p-2"
                    placeholder="Template name"
                    value={form.name}
                    onChange={(e) => field('name', e.target.value)}
                />
                <input
                    required
                    aria-label="Template key"
                    className="rounded-md border p-2"
                    placeholder="membership-expiring"
                    value={form.key}
                    onChange={(e) => field('key', e.target.value)}
                />
                <select
                    aria-label="Channel"
                    className="rounded-md border p-2"
                    value={form.channel}
                    onChange={(e) => field('channel', e.target.value)}
                >
                    <option value="in_app">In app</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS adapter</option>
                    <option value="whatsapp">WhatsApp adapter</option>
                </select>
                <input
                    aria-label="Subject"
                    className="rounded-md border p-2"
                    placeholder="Subject"
                    value={form.subject ?? ''}
                    onChange={(e) => field('subject', e.target.value)}
                />
                <textarea
                    required
                    aria-label="Body"
                    className="min-h-40 rounded-md border p-2"
                    placeholder="Hello {{ member_name }}"
                    value={form.body}
                    onChange={(e) => field('body', e.target.value)}
                />
                <input
                    aria-label="Allowed variables"
                    className="rounded-md border p-2"
                    placeholder="member_name, expires_on"
                    value={variables}
                    onChange={(e) => setVariables(e.target.value)}
                />
                {error && (
                    <p role="alert" className="text-destructive">
                        {error}
                    </p>
                )}
                <button
                    disabled={saving}
                    className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
                >
                    {saving ? 'Saving…' : 'Save template'}
                </button>
            </form>
        </main>
    );
}
