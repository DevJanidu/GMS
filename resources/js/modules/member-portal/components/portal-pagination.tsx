import { Button } from '@/components/ui/button';
import type { ApiPage } from '../types';

type PageMeta = ApiPage<unknown>['meta'];

export function PortalPagination({
    meta,
    onPageChange,
}: {
    meta: PageMeta;
    onPageChange: (page: number) => void;
}) {
    if (meta.last_page <= 1) {
        return null;
    }

    return (
        <nav
            aria-label="Pagination"
            className="flex items-center justify-between gap-3"
        >
            <p className="text-sm text-muted-foreground">
                Page {meta.current_page} of {meta.last_page}
            </p>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={meta.current_page <= 1}
                    onClick={() => onPageChange(meta.current_page - 1)}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={meta.current_page >= meta.last_page}
                    onClick={() => onPageChange(meta.current_page + 1)}
                >
                    Next
                </Button>
            </div>
        </nav>
    );
}
