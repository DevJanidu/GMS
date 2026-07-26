import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';
import { PageHeader } from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { can } from '@/lib/permissions/can';
import { reportDefinitions } from '../report-definitions';

export default function ReportCataloguePage() {
    const { auth } = usePage().props;
    const definitions = reportDefinitions.filter((definition) =>
        can(auth.user, definition.permission),
    );

    return (
        <>
            <Head title="Reports" />
            <main className="mx-auto flex w-full max-w-[1500px] flex-col gap-6 p-4 sm:p-6">
                <PageHeader
                    title="Report catalogue"
                    description="Operational and financial insights from authoritative source records."
                />
                {definitions.length === 0 ? (
                    <EmptyState
                        title="No reports available"
                        description="You do not have permission to view any reports."
                    />
                ) : (
                    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {definitions.map((definition) => (
                            <Card
                                key={definition.key}
                                className="transition-colors hover:bg-muted/30"
                            >
                                <CardHeader className="flex-row items-start justify-between">
                                    <div>
                                        <Badge variant="secondary">
                                            {definition.category}
                                        </Badge>
                                        <CardTitle className="mt-3">
                                            {definition.title}
                                        </CardTitle>
                                    </div>
                                    <BarChart3 className="size-5 text-emerald-600" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {definition.description}
                                    </p>
                                    <Link
                                        href={`/reports/${definition.key}`}
                                        className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline"
                                    >
                                        Open report <ArrowRight className="size-4" />
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </section>
                )}
            </main>
        </>
    );
}
