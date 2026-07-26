import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { branchesApi } from '@/modules/branches/api/branches';
import type { Branch } from '@/modules/branches/types';

export default function BranchIndex() {
    const [branches, setBranches] = useState<Branch[] | null>(null);
    const [search, setSearch] = useState('');
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            let cancelled = false;

            branchesApi
                .list({ search })
                .then((response) => {
                    if (!cancelled) {
                        setBranches(response.data);
                    }
                })
                .catch(() => {
                    if (!cancelled) {
                        setLoadError('Unable to load branches.');
                    }
                });

            return () => {
                cancelled = true;
            };
        }, 250);

        return () => clearTimeout(timeout);
    }, [search]);

    async function handleDelete(branch: Branch) {
        if (
            !confirm(`Delete branch "${branch.name}"? This cannot be undone.`)
        ) {
            return;
        }

        try {
            await branchesApi.remove(branch.id);
            setBranches(
                (current) => current?.filter((b) => b.id !== branch.id) ?? null,
            );
            toast.success('Branch deleted.');
        } catch {
            toast.error('Failed to delete branch.');
        }
    }

    return (
        <>
            <Head title="Branches" />

            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <Heading
                        title="Branches"
                        description="Manage your gym's locations"
                    />
                    <Button asChild>
                        <Link href="/branches/create">Add branch</Link>
                    </Button>
                </div>

                <Input
                    placeholder="Search by name or code…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />

                {loadError && (
                    <p className="text-sm text-destructive">{loadError}</p>
                )}

                {branches === null && !loadError && (
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                )}

                {branches !== null && branches.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        No branches yet.
                    </p>
                )}

                {branches !== null && branches.length > 0 && (
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/50 text-left">
                                <tr>
                                    <th className="p-3 font-medium">Name</th>
                                    <th className="p-3 font-medium">Code</th>
                                    <th className="p-3 font-medium">Staff</th>
                                    <th className="p-3 font-medium">Status</th>
                                    <th className="p-3 font-medium" />
                                </tr>
                            </thead>
                            <tbody>
                                {branches.map((branch) => (
                                    <tr
                                        key={branch.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="p-3">
                                            <Link
                                                href={`/branches/${branch.id}`}
                                                className="font-medium underline-offset-4 hover:underline"
                                            >
                                                {branch.name}
                                            </Link>
                                        </td>
                                        <td className="p-3 text-muted-foreground">
                                            {branch.code}
                                        </td>
                                        <td className="p-3 text-muted-foreground">
                                            {branch.staff_count ?? 0}
                                        </td>
                                        <td className="p-3">
                                            <Badge
                                                variant={
                                                    branch.status === 'active'
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {branch.status}
                                            </Badge>
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/branches/${branch.id}/edit`}
                                                    >
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDelete(branch)
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

BranchIndex.layout = {
    breadcrumbs: [{ title: 'Branches', href: '/branches' }],
};
