import { Head, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ErrorState } from '@/components/shared/error-state';
import { PageHeader } from '@/components/shared/page-header';
import { PageLoading } from '@/components/shared/page-loading';
import { ProtectedRoute } from '@/components/shared/protected-route';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api/client';
import type { ApiSuccess } from '@/lib/api/client';
import { can } from '@/lib/permissions/can';
import { NotificationList } from '../../components/notification-list';
import type { NotificationListItem } from '../../components/notification-list';
import { UnreadCounter } from '../../components/unread-counter';

type NotificationPayload = {
    id: string;
    type: string;
    title: string;
    body: string;
    read_at: string | null;
    created_at: string;
    failed?: boolean;
};

type NotificationPage = {
    success: true;
    data: NotificationPayload[];
    meta: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
};

function NotificationCenter() {
    const { auth } = usePage().props;
    const [notifications, setNotifications] = useState<NotificationListItem[]>(
        [],
    );
    const [unread, setUnread] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);

        try {
            const [page, count] = await Promise.all([
                apiClient.get<NotificationPage>('/notifications?per_page=50'),
                apiClient.get<ApiSuccess<{ count: number }>>(
                    '/notifications/unread-count',
                ),
            ]);
            setNotifications(
                page.data.map((notification) => ({
                    id: notification.id,
                    type: notification.type,
                    title: notification.title,
                    body: notification.body,
                    readAt: notification.read_at,
                    createdAt: notification.created_at,
                    failed: notification.failed,
                })),
            );
            setUnread(count.data.count);
            setError(null);
        } catch (reason) {
            setError(
                reason instanceof Error
                    ? reason.message
                    : 'Unable to load notifications.',
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = window.setTimeout(() => void load(), 0);

        return () => window.clearTimeout(timer);
    }, [load]);

    function update(action: () => Promise<unknown>) {
        setUpdating(true);
        action()
            .then(load)
            .catch((reason: unknown) =>
                toast.error(
                    reason instanceof Error
                        ? reason.message
                        : 'Unable to update the notification.',
                ),
            )
            .finally(() => setUpdating(false));
    }

    return (
        <>
            <Head title="Notification center" />
            <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:p-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <PageHeader
                        title="Notification center"
                        description="Messages and account updates for the signed-in recipient."
                    />
                    <div className="flex items-center gap-2">
                        <UnreadCounter count={unread} />
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={updating || unread === 0}
                            onClick={() =>
                                update(() =>
                                    apiClient.post(
                                        '/notifications/mark-all-read',
                                    ),
                                )
                            }
                        >
                            Mark all read
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <PageLoading />
                ) : error ? (
                    <ErrorState description={error} onRetry={load} />
                ) : (
                    <NotificationList
                        notifications={notifications}
                        canSeeFailures={can(
                            auth.user,
                            'notifications.failures.view',
                        )}
                        onRead={(id) =>
                            update(() =>
                                apiClient.patch(`/notifications/${id}/read`),
                            )
                        }
                        onUnread={(id) =>
                            update(() =>
                                apiClient.patch(`/notifications/${id}/unread`),
                            )
                        }
                    />
                )}
            </main>
        </>
    );
}

export default function MemberNotificationsPage() {
    return (
        <ProtectedRoute permission="notifications.center.view">
            <NotificationCenter />
        </ProtectedRoute>
    );
}
