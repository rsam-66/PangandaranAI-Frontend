import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import chatReducer from './chatSlice';
import historyReducer from './historySlice';
import faqReducer from './faqSlice';
import routeReducer from './routeSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        history: historyReducer,
        faq: faqReducer,
        routes: routeReducer,
        ui: uiReducer,
    },
});
