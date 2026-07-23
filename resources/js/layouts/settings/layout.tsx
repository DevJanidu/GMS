import type { PropsWithChildren } from 'react';

export default function SettingsLayout({ children }: PropsWithChildren) {
    return <div className="w-full space-y-12">{children}</div>;
}
