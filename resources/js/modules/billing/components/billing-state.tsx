import { AlertCircle, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BillingState({
    loading,
    error,
    retry,
}: {
    loading: boolean;
    error?: Error;
    retry: () => void;
}) {
    if (loading) {
        return (
            <div className="flex min-h-40 items-center justify-center gap-2 text-muted-foreground">
                <LoaderCircle className="size-5 animate-spin" /> Loading…
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-center">
                <AlertCircle className="size-6 text-destructive" />
                <p>{error.message}</p>
                <Button variant="outline" onClick={retry}>
                    Try again
                </Button>
            </div>
        );
    }

    return null;
}
