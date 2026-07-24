export function PortalPageHeader({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <header>
            <p className="text-xs font-semibold tracking-[0.18em] text-emerald-600 uppercase">
                Member portal
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                {title}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                {description}
            </p>
        </header>
    );
}
