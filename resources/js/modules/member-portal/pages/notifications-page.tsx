import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { NotificationList } from '@/modules/notifications/components/notification-list';
import { UnreadCounter } from '@/modules/notifications/components/unread-counter';
import { memberPortalApi } from '../api/member-portal';
import { PortalPageHeader } from '../components/portal-page-header';
import { PortalPagination } from '../components/portal-pagination';
import { PortalState } from '../components/portal-state';
import { useMemberPortalPage } from '../hooks/use-member-portal-page';

export default function MemberPortalNotificationsPage() {
    const resource = useMemberPortalPage(memberPortalApi.notifications);
    const [updating, setUpdating] = useState(false);

    function update(action: () => Promise<unknown>) {
        setUpdating(true);
        action()
            .then(resource.retry)
            .catch((reason: unknown) =>
                toast.error(
                    reason instanceof Error
                        ? reason.message
                        : 'Unable to update the notification.',
                ),
            )
            .finally(() => setUpdating(false));
    }

    const unread =
        resource.data?.filter((notification) => !notification.read_at).length ??
        0;

    return (
        <>
            <Head title="Notifications" />
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
                <PortalPageHeader
                    title="Notifications"
                    description="Membership, payment and gym updates sent to your account."
                />
                <div className="flex items-center justify-between gap-2 sm:justify-end">
                    <UnreadCounter count={unread} />
                    <Button
                        variant="outline"
                        size="sm"
                        className="min-h-9"
                        disabled={updating || unread === 0}
                        onClick={() =>
                            update(memberPortalApi.markAllNotificationsRead)
                        }
                    >
                        Mark all read
                    </Button>
                </div>
            </div>
            <PortalState {...resource}>
                {(notifications) => (
                    <div className="grid gap-4">
                        <NotificationList
                            notifications={notifications.map(
                                (notification) => ({
                                    id: notification.id,
                                    type: notification.type,
                                    title: notification.title,
                                    body: notification.body,
                                    readAt: notification.read_at,
                                    createdAt: notification.created_at,
                                }),
                            )}
                            onRead={(id) =>
                                update(() =>
                                    memberPortalApi.markNotificationRead(id),
                                )
                            }
                            onUnread={(id) =>
                                update(() =>
                                    memberPortalApi.markNotificationUnread(id),
                                )
                            }
                        />
                        {resource.meta && (
                            <PortalPagination
                                meta={resource.meta}
                                onPageChange={resource.setPage}
                            />
                        )}
                    </div>
                )}
            </PortalState>
        </>
    );
}
