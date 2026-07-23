import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ErrorState({
    title = 'Something went wrong',
    description,
    onRetry,
}: {
    title?: string;
    description: string;
    onRetry?: () => void;
}) {
    return (
        <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/50 p-8 text-center dark:border-red-950 dark:bg-red-950/20">
            <AlertCircle className="mb-3 size-6 text-red-600" />
            <h3 className="font-semibold">{title}</h3>
            <p className="text-muted-foreground mt-1 max-w-sm text-sm">
                {description}
            </p>
            {onRetry && (
                <Button className="mt-5" variant="outline" onClick={onRetry}>
                    Try again
                </Button>
            )}
        </div>
    );
}
