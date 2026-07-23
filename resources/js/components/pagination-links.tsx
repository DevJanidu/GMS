import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import type { PaginationLink } from '@/types';

export function PaginationLinks({ links }: { links: PaginationLink[] }) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav
            aria-label="Pagination"
            className="flex flex-wrap items-center gap-1"
        >
            {links.map((link, index) => (
                <Button
                    key={index}
                    asChild={link.url !== null}
                    variant={link.active ? 'default' : 'outline'}
                    size="sm"
                    disabled={link.url === null}
                    className="min-w-9"
                >
                    {link.url !== null ? (
                        <Link
                            href={link.url}
                            preserveScroll
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <span
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    )}
                </Button>
            ))}
        </nav>
    );
}
