import { configureStore, combineReducers } from '@reduxjs/toolkit';
import routeReducer from './routeSlice';
import uiReducer from './uiSlice';

/**
 * Redux store — lazily loads heavy slices (chat, history, faq, auth).
 *
 * The home page only needs `ui` and `routes`. The remaining slices
 * (chat, history, faq, auth) are injected on-demand when a page like
 * /chatbot first accesses them, keeping the initial JS bundle small.
 */

// Lightweight placeholder reducers — replaced when the real slice loads.
const lazyPlaceholder = (initial = {}) => (state = initial) => state;

const store = configureStore({
    reducer: {
        // Always loaded — tiny footprint, used on every page
        ui: uiReducer,
        routes: routeReducer,
        // Lazy placeholders — will be replaced via store.replaceReducer()
        auth: lazyPlaceholder({ initialized: false, token: null }),
        chat: lazyPlaceholder({ messages: [], loading: false, loadingHistory: false, error: null }),
        history: lazyPlaceholder({ sessions: [], activeSessionId: null, loading: false }),
        faq: lazyPlaceholder({ items: [] }),
    },
});

/** Track which slices have been injected */
const injectedSlices = new Set(['ui', 'routes']);

/** Current reducer map — kept in sync for replaceReducer calls */
const reducerMap = {
    ui: uiReducer,
    routes: routeReducer,
    auth: lazyPlaceholder({ initialized: false, token: null }),
    chat: lazyPlaceholder({ messages: [], loading: false, loadingHistory: false, error: null }),
    history: lazyPlaceholder({ sessions: [], activeSessionId: null, loading: false }),
    faq: lazyPlaceholder({ items: [] }),
};

/**
 * Inject a reducer at runtime.  
 * Calling this multiple times for the same key is a no-op.
 *
 * @param {string} key - Slice name (e.g. 'chat')
 * @param {Function} reducer - The real slice reducer
 */
export function injectReducer(key, reducer) {
    if (injectedSlices.has(key)) return;
    injectedSlices.add(key);
    reducerMap[key] = reducer;
    store.replaceReducer(combineReducers(reducerMap));
}

/**
 * Load and inject all chatbot-related slices at once.
 * Called once when the user first navigates to /chatbot or /search.
 */
export async function injectChatbotSlices() {
    if (injectedSlices.has('chat')) return; // already loaded

    const [authMod, chatMod, historyMod, faqMod] = await Promise.all([
        import('./authSlice'),
        import('./chatSlice'),
        import('./historySlice'),
        import('./faqSlice'),
    ]);

    injectReducer('auth', authMod.default);
    injectReducer('chat', chatMod.default);
    injectReducer('history', historyMod.default);
    injectReducer('faq', faqMod.default);
}

export { store };
