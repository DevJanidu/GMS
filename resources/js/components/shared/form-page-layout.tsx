import type { ReactNode } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';

export function FormPageLayout({
    title,
    description,
    actions,
    children,
    aside,
}: {
    title: string;
    description?: string;
    actions?: ReactNode;
    children: ReactNode;
    aside?: ReactNode;
}) {
    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
            <PageHeader
                title={title}
                description={description}
                actions={actions}
            />
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
                <Card>
                    <CardContent>{children}</CardContent>
                </Card>
                {aside && <aside>{aside}</aside>}
            </div>
        </div>
    );
}
