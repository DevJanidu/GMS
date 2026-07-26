import { Bell, BellDot, CircleAlert } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/shared/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export type NotificationListItem = {
    id: string;
    type: string;
    title: string;
    body: string;
    readAt: string | null;
    createdAt: string;
    failed?: boolean;
};

export function NotificationList({
    notifications,
    onRead,
    onUnread,
    canSeeFailures = false,
}: {
    notifications: NotificationListItem[];
    onRead?: (id: string) => void;
    onUnread?: (id: string) => void;
    canSeeFailures?: boolean;
}) {
    const [detailsId, setDetailsId] = useState<string | null>(null);
    const detailsNotification =
        notifications.find((item) => item.id === detailsId) ?? null;

    if (notifications.length === 0) {
        return (
            <EmptyState
                icon={Bell}
                title="You're all caught up"
                description="New notifications will appear here."
            />
        );
    }

    return (
        <div className="grid gap-3">
            <Dialog
                open={detailsNotification !== null}
                onOpenChange={(open) => !open && setDetailsId(null)}
            >
                <DialogContent>
                    {detailsNotification && (
                        <>
                            <DialogHeader>
                                <DialogTitle>
                                    {detailsNotification.title}
                                </DialogTitle>
                                <DialogDescription className="whitespace-pre-line text-left">
                                    {detailsNotification.body}
                                </DialogDescription>
                            </DialogHeader>
                            <dl className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <dt className="text-muted-foreground">
                                        Type
                                    </dt>
                                    <dd className="font-medium">
                                        {detailsNotification.type}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">
                                        Status
                                    </dt>
                                    <dd className="font-medium">
                                        {detailsNotification.readAt
                                            ? 'Read'
                                            : 'Unread'}
                                        {canSeeFailures &&
                                            detailsNotification.failed &&
                                            ' · Delivery failed'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">
                                        Sent
                                    </dt>
                                    <dd className="font-medium">
                                        {new Date(
                                            detailsNotification.createdAt,
                                        ).toLocaleString()}
                                    </dd>
                                </div>
                                {detailsNotification.readAt && (
                                    <div>
                                        <dt className="text-muted-foreground">
                                            Read at
                                        </dt>
                                        <dd className="font-medium">
                                            {new Date(
                                                detailsNotification.readAt,
                                            ).toLocaleString()}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </>
                    )}
                </DialogContent>
            </Dialog>
            {notifications.map((notification) => (
                <Card
                    key={notification.id}
                    className={cn(
                        'py-0',
                        !notification.readAt &&
                            'border-emerald-300 bg-emerald-50/40 dark:border-emerald-900 dark:bg-emerald-950/20',
                    )}
                >
                    <CardContent className="flex gap-4 p-4">
                        <div className="mt-1">
                            {notification.readAt ? (
                                <Bell className="size-5 text-muted-foreground" />
                            ) : (
                                <BellDot className="size-5 text-emerald-600" />
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                    <button
                                        type="button"
                                        className="text-left font-semibold hover:underline"
                                        onClick={() =>
                                            setDetailsId(notification.id)
                                        }
                                    >
                                        {notification.title}
                                    </button>
                                    <p className="mt-1 line-clamp-2 whitespace-pre-line text-sm text-muted-foreground">
                                        {notification.body}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!notification.readAt && (
                                        <Badge variant="secondary">Unread</Badge>
                                    )}
                                    {canSeeFailures &&
                                        notification.failed && (
                                            <Badge variant="destructive">
                                                <CircleAlert />
                                                Delivery failed
                                            </Badge>
                                        )}
                                </div>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                                <time className="text-xs text-muted-foreground">
                                    {new Date(
                                        notification.createdAt,
                                    ).toLocaleString()}
                                </time>
                                {!notification.readAt && onRead && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            onRead(notification.id)
                                        }
                                    >
                                        Mark as read
                                    </Button>
                                )}
                                {notification.readAt && onUnread && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            onUnread(notification.id)
                                        }
                                    >
                                        Mark as unread
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
