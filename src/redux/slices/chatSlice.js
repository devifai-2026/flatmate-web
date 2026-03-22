import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchConversations = createAsyncThunk('chat/fetchConversations', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/chat/conversations');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch conversations');
  }
});

export const fetchMessages = createAsyncThunk('chat/fetchMessages', async ({ conversationId, page = 1, prepend = false }, { rejectWithValue }) => {
  try {
    const res = await api.get(`/chat/${conversationId}/messages`, { params: { page, limit: 30 } });
    return { conversationId, messages: res.data.messages, pagination: res.data.pagination, prepend };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch messages');
  }
});

export const sendMessage = createAsyncThunk('chat/sendMessage', async ({ conversationId, text }, { rejectWithValue }) => {
  try {
    const res = await api.post(`/chat/${conversationId}/messages`, { text });
    return { conversationId, message: res.data.data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to send message');
  }
});

export const sendDirectMessage = createAsyncThunk('chat/sendDirect', async ({ receiverId, text }, { rejectWithValue }) => {
  try {
    const res = await api.post('/messages', { receiverId, text });
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to send message');
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: [],
    messages: {},
    messagePagination: {}, // conversationId → { total, page, pages }
    activeConversation: null,
    loading: false,
    error: null,
  },
  reducers: {
    setActiveConversation(state, action) {
      state.activeConversation = action.payload;
    },
    addMessage(state, action) {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) state.messages[conversationId] = [];
      // Avoid duplicates
      const exists = state.messages[conversationId].some((m) => m._id === message._id);
      if (!exists) state.messages[conversationId].push(message);
    },
    markMessagesRead(state, action) {
      const { conversationId } = action.payload;
      const msgs = state.messages[conversationId];
      if (msgs) {
        msgs.forEach((m) => { m.status = 'read'; });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => { state.loading = true; })
      .addCase(fetchConversations.fulfilled, (state, action) => { state.loading = false; state.conversations = action.payload; })
      .addCase(fetchConversations.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { conversationId, messages, pagination, prepend } = action.payload;
        if (prepend && state.messages[conversationId]) {
          // Prepend older messages — dedup
          const existingIds = new Set(state.messages[conversationId].map((m) => m._id));
          const older = messages.filter((m) => !existingIds.has(m._id));
          state.messages[conversationId] = [...older, ...state.messages[conversationId]];
        } else {
          state.messages[conversationId] = messages;
        }
        state.messagePagination[conversationId] = pagination;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { conversationId, message } = action.payload;
        if (!state.messages[conversationId]) state.messages[conversationId] = [];
        state.messages[conversationId].push(message);
      });
  },
});

export const { setActiveConversation, addMessage, markMessagesRead } = chatSlice.actions;
export default chatSlice.reducer;
