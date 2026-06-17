import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSessions, createSessionAPI, deleteSessionAPI } from '@/services/api';

/**
 * Fetch all sessions from backend
 * GET /sessions
 */
export const loadSessions = createAsyncThunk(
    'history/loadSessions',
    async (_, { rejectWithValue }) => {
        try {
            const sessions = await fetchSessions();
            return sessions;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Create a new session on backend
 * POST /sessions { title }
 */
export const createSession = createAsyncThunk(
    'history/createSession',
    async (title = 'New Chat', { rejectWithValue }) => {
        try {
            const session = await createSessionAPI(title);
            return session;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Delete a session from backend
 * DELETE /sessions/{id}
 */
export const deleteSession = createAsyncThunk(
    'history/deleteSession',
    async (sessionId, { rejectWithValue }) => {
        try {
            await deleteSessionAPI(sessionId);
            return sessionId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const historySlice = createSlice({
    name: 'history',
    initialState: {
        sessions: [],
        activeSessionId: null,
        loading: false,
        error: null,
    },
    reducers: {
        switchSession: (state, action) => {
            state.activeSessionId = action.payload;
        },
        clearActiveSession: (state) => {
            state.activeSessionId = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Load sessions
            .addCase(loadSessions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadSessions.fulfilled, (state, action) => {
                state.loading = false;
                state.sessions = action.payload || [];
            })
            .addCase(loadSessions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create session
            .addCase(createSession.fulfilled, (state, action) => {
                state.sessions.unshift(action.payload);
                state.activeSessionId = action.payload.id;
            })
            // Delete session — remove from Redux on both success AND failure (e.g. 404)
            // This handles orphaned sessions that exist in Redux but were already
            // deleted or never persisted on the backend.
            .addCase(deleteSession.fulfilled, (state, action) => {
                state.sessions = state.sessions.filter((s) => s.id !== action.payload);
                if (state.activeSessionId === action.payload) {
                    state.activeSessionId = null;
                }
            })
            .addCase(deleteSession.rejected, (state, action) => {
                // Even if the backend 404'd (session didn't exist), still clean up Redux
                // The session ID is passed as the first argument to the thunk
                const sessionId = action.meta.arg;
                state.sessions = state.sessions.filter((s) => s.id !== sessionId);
                if (state.activeSessionId === sessionId) {
                    state.activeSessionId = null;
                }
            });
    },
});

export const { switchSession, clearActiveSession } = historySlice.actions;
export default historySlice.reducer;
