import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { branchesApi } from '@/modules/branches/api/branches';
import type { Branch } from '@/modules/branches/types';

export default function BranchShow({ branchId }: { branchId: number }) {
    const [branch, setBranch] = useState<Branch | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        branchesApi
            .get(branchId)
            .then((response) => setBranch(response.data))
            .catch(() => setLoadError(true));
    }, [branchId]);

    if (loadError) {
        return (
            <>
                <Head title="Branch not found" />
                <p className="text-sm text-destructive">
                    Unable to load this branch.
                </p>
            </>
        );
    }

    if (!branch) {
        return (
            <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    return (
        <>
            <Head title={branch.name} />

            <div className="max-w-2xl space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <Heading title={branch.name} description={branch.code} />
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/branches/${branch.id}/opening-hours`}>
                                Opening hours
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/branches/${branch.id}/edit`}>
                                Edit
                            </Link>
                        </Button>
                    </div>
                </div>

                <dl className="grid grid-cols-1 gap-4 rounded-lg border p-4 sm:grid-cols-2">
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Status
                        </dt>
                        <dd className="mt-1">
                            <Badge
                                variant={
                                    branch.status === 'active'
                                        ? 'default'
                                        : 'secondary'
                                }
                            >
                                {branch.status}
                            </Badge>
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Staff assigned
                        </dt>
                        <dd className="mt-1">{branch.staff_count ?? 0}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Address
                        </dt>
                        <dd className="mt-1">{branch.address || '—'}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">Phone</dt>
                        <dd className="mt-1">{branch.phone || '—'}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">Email</dt>
                        <dd className="mt-1">{branch.email || '—'}</dd>
                    </div>
                </dl>
            </div>
        </>
    );
}

BranchShow.layout = {
    breadcrumbs: [
        { title: 'Branches', href: '/branches' },
        { title: 'Details', href: '' },
    ],
};
