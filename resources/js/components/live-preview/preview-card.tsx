import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function PreviewCard({ children }: { children: ReactNode }) {
    return (
        <Card className="sticky top-6 border-0 bg-transparent shadow-none">
            <CardContent>
                <div className="flex flex-col items-center gap-4 text-center">
                    {children}
                </div>
            </CardContent>
        </Card>
    );
}
