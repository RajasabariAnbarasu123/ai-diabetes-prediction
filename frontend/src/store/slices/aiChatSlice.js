import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import aiService from '../../services/aiService';

export const sendChatMessage = createAsyncThunk(
  'aiChat/send',
  async (message, { rejectWithValue }) => {
    try {
      const data = await aiService.chat(message);
      return data; // { reply, conversationId }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchChatHistory = createAsyncThunk(
  'aiChat/history',
  async (_, { rejectWithValue }) => {
    try {
      const data = await aiService.getChatHistory();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  messages: [], // { role: 'user'|'assistant', content, timestamp }
  loading: false,
  error: null,
};

const aiChatSlice = createSlice({
  name: 'aiChat',
  initialState,
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({
        role: 'user',
        content: action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    clearChat: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          role: 'assistant',
          content: action.payload.reply,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.messages.push({
          role: 'assistant',
          content: `AI Error: ${action.payload || 'Failed to get response from AI. Please try again.'}`,
          timestamp: new Date().toISOString(),
          isError: true,
        });
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.messages = action.payload;
        }
      });
  },
});

export const { addUserMessage, clearChat } = aiChatSlice.actions;
export default aiChatSlice.reducer;