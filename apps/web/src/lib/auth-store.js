const STORAGE_KEY = 'auth_session';
let session = null;
const listeners = new Set();
function loadFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return null;
        const parsed = JSON.parse(raw);
        if (new Date(parsed.expiresAt) < new Date()) {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }
        return parsed;
    }
    catch {
        return null;
    }
}
session = loadFromStorage();
function notify() {
    listeners.forEach(fn => fn());
}
export const authStore = {
    getSession: () => session,
    getToken: () => session?.token ?? null,
    getUser: () => session?.user ?? null,
    setSession: (s) => {
        session = s;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
        notify();
    },
    clearSession: () => {
        session = null;
        localStorage.removeItem(STORAGE_KEY);
        notify();
    },
    subscribe: (fn) => {
        listeners.add(fn);
        return () => listeners.delete(fn);
    },
};
