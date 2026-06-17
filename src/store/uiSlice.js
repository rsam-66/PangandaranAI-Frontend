import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        activeTab: 'home',        // 'home' | 'search' | 'chatbot'
        sidebarOpen: false,
    },
    reducers: {
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        closeSidebar: (state) => {
            state.sidebarOpen = false;
        },
    },
});

export const { setActiveTab, toggleSidebar, closeSidebar } = uiSlice.actions;
export default uiSlice.reducer;
