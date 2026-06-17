import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sendSessionChat, fetchMessages } from '@/services/api';

/**
 * Send a message within a session (RAG backend)
 * POST /sessions/{id}/chat { question }
 * Backend also saves user + assistant messages to DB
 */
export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { chat, history } = getState();
            const sessionId = history.activeSessionId;

            if (!sessionId) {
                return rejectWithValue('No active session');
            }

            // Get the last user message
            const lastUserMsg = [...chat.messages].reverse().find((m) => m.role === 'user');
            if (!lastUserMsg) {
                return rejectWithValue('No user message to send');
            }

            const response = await sendSessionChat(sessionId, lastUserMsg.content);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to get response');
        }
    }
);

/**
 * Load message history for a session
 * GET /sessions/{id}/messages
 */
export const loadSessionMessages = createAsyncThunk(
    'chat/loadSessionMessages',
    async (sessionId, { rejectWithValue }) => {
        try {
            const messages = await fetchMessages(sessionId);
            return messages;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        messages: [],       // Array of { id, role, content, timestamp }
        loading: false,
        loadingHistory: false,
        error: null,
    },
    reducers: {
        addUserMessage: (state, action) => {
            state.messages.push({
                id: Date.now().toString(),
                role: 'user',
                content: action.payload,
                timestamp: new Date().toISOString(),
            });
            state.error = null;
        },
        clearMessages: (state) => {
            state.messages = [];
            state.error = null;
        },
        loadMessages: (state, action) => {
            state.messages = action.payload || [];
            state.error = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Send message (RAG)
            .addCase(sendMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.messages.push({
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: action.payload.answer,  // Backend returns { answer, sources }
                    timestamp: new Date().toISOString(),
                });
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Something went wrong';
            })
            // Load session messages
            .addCase(loadSessionMessages.pending, (state) => {
                state.loadingHistory = true;
                state.error = null;
            })
            .addCase(loadSessionMessages.fulfilled, (state, action) => {
                state.loadingHistory = false;
                // Map backend format { id, role, content, created_at } to our format
                // Sort by id (auto-increment) to guarantee correct order,
                // since user + assistant messages share the same commit timestamp
                const sorted = [...(action.payload || [])].sort((a, b) => a.id - b.id);
                state.messages = sorted.map((msg) => ({
                    id: msg.id?.toString() || Date.now().toString(),
                    role: msg.role,
                    content: msg.content,
                    timestamp: msg.created_at || new Date().toISOString(),
                }));
            })
            .addCase(loadSessionMessages.rejected, (state, action) => {
                state.loadingHistory = false;
                state.error = action.payload;
            });
    },
});

export const { addUserMessage, clearMessages, loadMessages, setError } = chatSlice.actions;
export default chatSlice.reducer;
