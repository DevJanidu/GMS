/**
 * Minimal fetch wrapper for the /api/v1 JSON endpoints. Sanctum's SPA
 * (cookie/session) auth just needs the XSRF-TOKEN cookie echoed back as a
 * header on state-changing requests, so this stays dependency-free rather
 * than pulling in axios/React Query.
 */

export type ApiSuccess<T> = {
    success: true;
    message?: string;
    data: T;
    meta?: {
        current_page: number;
        per_page: number;
        total: number | null;
        last_page: number | null;
    };
};

export type ApiError = {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
};

export class ApiRequestError extends Error {
    status: number;
    errors?: Record<string, string[]>;

    constructor(response: ApiError, status: number) {
        super(response.message);
        this.status = status;
        this.errors = response.errors;
    }
}

function readCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));

    return match ? decodeURIComponent(match[1]) : null;
}

async function request<T>(
    method: string,
    path: string,
    body?: unknown,
): Promise<T> {
    const headers: Record<string, string> = {
        Accept: 'application/json',
    };

    if (body !== undefined) {
        headers['Content-Type'] = 'application/json';
    }

    const xsrfToken = readCookie('XSRF-TOKEN');

    if (xsrfToken) {
        headers['X-XSRF-TOKEN'] = xsrfToken;
    }

    const response = await fetch(`/api/v1${path}`, {
        method,
        headers,
        credentials: 'same-origin',
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const json = await response.json().catch(() => null);

    if (!response.ok) {
        throw new ApiRequestError(
            json ?? { success: false, message: response.statusText },
            response.status,
        );
    }

    return json as T;
}

async function requestForm<T>(
    method: string,
    path: string,
    formData: FormData,
): Promise<T> {
    const headers: Record<string, string> = {
        Accept: 'application/json',
    };

    const xsrfToken = readCookie('XSRF-TOKEN');

    if (xsrfToken) {
        headers['X-XSRF-TOKEN'] = xsrfToken;
    }

    // PHP can't parse multipart bodies on PUT/PATCH requests, so this is
    // sent as a real POST with Laravel's `_method` spoofing field — the
    // same convention Laravel's own form helpers use for file uploads.
    if (method !== 'POST') {
        formData.append('_method', method);
    }

    const response = await fetch(`/api/v1${path}`, {
        method: 'POST',
        headers,
        credentials: 'same-origin',
        body: formData,
    });

    const json = await response.json().catch(() => null);

    if (!response.ok) {
        throw new ApiRequestError(
            json ?? { success: false, message: response.statusText },
            response.status,
        );
    }

    return json as T;
}

export const apiClient = {
    get: <T>(path: string) => request<T>('GET', path),
    post: <T>(path: string, body?: unknown) =>
        request<T>('POST', path, body ?? {}),
    put: <T>(path: string, body?: unknown) =>
        request<T>('PUT', path, body ?? {}),
    patch: <T>(path: string, body?: unknown) =>
        request<T>('PATCH', path, body ?? {}),
    delete: <T>(path: string) => request<T>('DELETE', path),
    putForm: <T>(path: string, formData: FormData) =>
        requestForm<T>('PUT', path, formData),
};
