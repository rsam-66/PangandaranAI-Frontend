'use client';

import { Provider } from 'react-redux';
import { store } from './store';

/**
 * Redux StoreProvider — wraps the app with the Redux <Provider>.
 *
 * Auth initialization is deferred to pages that actually need it
 * (e.g. /chatbot) via injectChatbotSlices(), keeping the home page
 * JS bundle lightweight.
 */
export default function StoreProvider({ children }) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}
