import { AlertCircle, Inbox, LoaderCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export function AttendanceLoading({ label = 'Loading attendance…' }) {
    return (
        <div
            className="flex min-h-32 items-center justify-center gap-2 text-sm text-muted-foreground"
            role="status"
        >
            <LoaderCircle className="size-4 animate-spin" />
            {label}
        </div>
    );
}

export function AttendanceEmpty({ message }: { message: string }) {
    return (
        <div className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center">
            <Inbox className="size-7 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    );
}

export function AttendanceError({
    message,
    retry,
}: {
    message: string;
    retry?: () => void;
}) {
    return (
        <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Attendance could not be loaded</AlertTitle>
            <AlertDescription>
                <p>{message}</p>
                {retry && (
                    <Button size="sm" variant="outline" onClick={retry}>
                        Try again
                    </Button>
                )}
            </AlertDescription>
        </Alert>
    );
}
