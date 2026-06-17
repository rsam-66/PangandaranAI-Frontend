import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authenticate, getStoredToken } from '@/services/api';

/**
 * Auto-authenticate on first visit.
 * Checks localStorage for existing token, requests new one if none found.
 */
export const initAuth = createAsyncThunk(
    'auth/initAuth',
    async (_, { rejectWithValue }) => {
        try {
            // Check for existing token
            const existingToken = getStoredToken();
            if (existingToken) {
                return existingToken;
            }

            // No token — request a new one
            const token = await authenticate();
            return token;
        } catch (error) {
            return rejectWithValue(error.message || 'Authentication failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        loading: false,
        initialized: false,
        error: null,
    },
    reducers: {
        clearAuth: (state) => {
            state.token = null;
            state.initialized = false;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('pangandaran_auth_token');
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload;
                state.initialized = true;
            })
            .addCase(initAuth.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Auth failed';
                state.initialized = true; // Still mark as initialized so app doesn't hang
            });
    },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
