import { createSlice } from '@reduxjs/toolkit';
import { loadFromStorage, saveToStorage } from '@/utils/localStorage';

const STORAGE_KEY = 'pangandaran_saved_routes';

/**
 * Route Slice — manages user's saved travel routes.
 * Persisted to localStorage so routes survive page refreshes.
 *
 * Actions:
 *   saveRoute(destination) — adds a route to saved list (no duplicates)
 *   removeRoute(id) — removes a route by ID
 *   markVisited(id) — marks a route as visited
 */
const routeSlice = createSlice({
    name: 'routes',
    initialState: {
        savedRoutes: loadFromStorage(STORAGE_KEY, []),
        loading: false,
    },
    reducers: {
        saveRoute: (state, action) => {
            const exists = state.savedRoutes.find(r => r.id === action.payload.id);
            if (!exists) {
                state.savedRoutes.unshift({
                    ...action.payload,
                    savedAt: new Date().toISOString(),
                    visited: false,
                });
                saveToStorage(STORAGE_KEY, state.savedRoutes);
            }
        },
        removeRoute: (state, action) => {
            state.savedRoutes = state.savedRoutes.filter(r => r.id !== action.payload);
            saveToStorage(STORAGE_KEY, state.savedRoutes);
        },
        markVisited: (state, action) => {
            const route = state.savedRoutes.find(r => r.id === action.payload);
            if (route) {
                route.visited = true;
                saveToStorage(STORAGE_KEY, state.savedRoutes);
            }
        },
    },
});

export const { saveRoute, removeRoute, markVisited } = routeSlice.actions;
export default routeSlice.reducer;
