const BASE = import.meta.env.VITE_API_URL ?? '';
class ApiError extends Error {
    constructor(code, message, status) {
        super(message);
        Object.defineProperty(this, "code", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: code
        });
        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: status
        });
        this.name = 'ApiError';
    }
}
async function request(path, init, token) {
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers ?? {}),
    };
    const res = await fetch(`${BASE}/api${path}`, { ...init, headers });
    const json = await res.json();
    if (!json.success || json.data === null) {
        throw new ApiError(json.error?.code ?? 'UNKNOWN', json.error?.message ?? 'Request failed', res.status);
    }
    return json.data;
}
export function createApiClient(getToken) {
    const get = (path) => request(path, { method: 'GET' }, getToken());
    const post = (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }, getToken());
    const patch = (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }, getToken());
    const del = (path) => request(path, { method: 'DELETE' }, getToken());
    return { get, post, patch, del };
}
export { ApiError };
