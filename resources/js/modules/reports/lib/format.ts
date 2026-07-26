export function humanize(key: string): string {
    return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatDateValue(value: unknown, withTime = false): string {
    if (typeof value !== 'string' || value === '') {
        return '—';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return withTime ? date.toLocaleString() : date.toLocaleDateString();
}

export function formatHour(value: unknown): string {
    const hour = Number(value);

    return Number.isFinite(hour) ? `${String(hour).padStart(2, '0')}:00` : '—';
}
