/**
 * localStorage utility helpers
 * Safe wrappers that handle SSR (server-side) and errors gracefully
 */

export function loadFromStorage(key, fallback = null) {
    if (typeof window === 'undefined') return fallback;
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch {
        return fallback;
    }
}

export function saveToStorage(key, value) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        console.warn(`Failed to save to localStorage key: ${key}`);
    }
}

export function removeFromStorage(key) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(key);
    } catch {
        console.warn(`Failed to remove localStorage key: ${key}`);
    }
}
