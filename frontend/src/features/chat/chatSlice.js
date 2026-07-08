import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { chatService } from "../../services/chatService.js";
import { getApiError } from "../../services/apiClient.js";

export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async (params, thunkApi) => {
    try {
      const response = await chatService.getConversations(params);
      return response.data.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getApiError(error, "Could not load conversations"));
    }
  }
);

export const fetchMessages = createAsyncThunk("chat/fetchMessages", async (id, thunkApi) => {
  try {
    const response = await chatService.getMessages(id);
    return { id, messages: response.data.data };
  } catch (error) {
    return thunkApi.rejectWithValue(getApiError(error, "Could not load messages"));
  }
});

export const sendMessage = createAsyncThunk("chat/sendMessage", async (payload, thunkApi) => {
  try {
    const assistantId = `assistant-${Date.now()}-${Math.random()}`;
    const response = await chatService.sendMessage({
      ...payload,
      onStart: (conversationId) => {
        thunkApi.dispatch(streamStarted({ assistantId, conversationId }));
      },
      onChunk: (text) => {
        thunkApi.dispatch(streamChunkReceived({ assistantId, text }));
      },
    });

    return {
      request: payload,
      assistantId,
      result: response.data.data,
    };
  } catch (error) {
    return thunkApi.rejectWithValue(getApiError(error, "Nova could not answer"));
  }
});

export const renameConversation = createAsyncThunk(
  "chat/renameConversation",
  async ({ id, title }, thunkApi) => {
    try {
      const response = await chatService.renameConversation(id, title);
      return response.data.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getApiError(error, "Could not rename conversation"));
    }
  }
);

export const togglePin = createAsyncThunk("chat/togglePin", async (id, thunkApi) => {
  try {
    const response = await chatService.togglePin(id);
    return response.data.data;
  } catch (error) {
    return thunkApi.rejectWithValue(getApiError(error, "Could not update conversation"));
  }
});

export const deleteConversation = createAsyncThunk(
  "chat/deleteConversation",
  async (id, thunkApi) => {
    try {
      await chatService.deleteConversation(id);
      return id;
    } catch (error) {
      return thunkApi.rejectWithValue(getApiError(error, "Could not delete conversation"));
    }
  }
);

const makeLocalMessage = ({ role, content }) => ({
  _id: `${role}-${Date.now()}-${Math.random()}`,
  role,
  content,
  createdAt: new Date().toISOString(),
});

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    conversations: [],
    pagination: null,
    activeConversationId: null,
    messages: [],
    conversationsStatus: "idle",
    messagesStatus: "idle",
    sendingStatus: "idle",
    streamingMessageId: null,
    error: null,
    search: "",
  },
  reducers: {
    setActiveConversation(state, action) {
      state.activeConversationId = action.payload;
      state.messages = [];
      state.error = null;
    },
    startNewChat(state) {
      state.activeConversationId = null;
      state.messages = [];
      state.error = null;
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
    clearChatError(state) {
      state.error = null;
    },
    streamStarted(state, action) {
      const { assistantId, conversationId } = action.payload;
      state.streamingMessageId = assistantId;
      if (conversationId) {
        state.activeConversationId = conversationId;
      }

      const existing = state.messages.find((item) => item._id === assistantId);
      if (!existing) {
        state.messages.push({
          _id: assistantId,
          role: "assistant",
          content: "",
          createdAt: new Date().toISOString(),
        });
      }
    },
    streamChunkReceived(state, action) {
      const { assistantId, text } = action.payload;
      const message = state.messages.find((item) => item._id === assistantId);

      if (message) {
        message.content += text;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.conversationsStatus = "loading";
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversationsStatus = "succeeded";
        state.conversations = action.payload.conversations || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.conversationsStatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.messagesStatus = "loading";
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messagesStatus = "succeeded";
        state.activeConversationId = action.payload.id;
        state.messages = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.messagesStatus = "failed";
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state, action) => {
        state.sendingStatus = "loading";
        state.streamingMessageId = null;
        state.error = null;
        state.messages.push(makeLocalMessage({ role: "user", content: action.meta.arg.message }));
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendingStatus = "succeeded";
        state.streamingMessageId = null;
        const { assistantId, result } = action.payload;
        state.activeConversationId = result.conversationId;

        const streamedMessage = state.messages.find((item) => item._id === assistantId);
        if (streamedMessage) {
          streamedMessage.content = streamedMessage.content || result.response || "";
        } else {
          state.messages.push(
            makeLocalMessage({ role: "assistant", content: result.response || "" })
          );
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingStatus = "failed";
        state.streamingMessageId = null;
        state.error = action.payload;
      })
      .addCase(renameConversation.fulfilled, (state, action) => {
        const index = state.conversations.findIndex((item) => item._id === action.payload._id);
        if (index >= 0) state.conversations[index] = action.payload;
      })
      .addCase(togglePin.fulfilled, (state, action) => {
        const index = state.conversations.findIndex((item) => item._id === action.payload._id);
        if (index >= 0) state.conversations[index] = action.payload;
        state.conversations.sort((a, b) => Number(b.isPinned) - Number(a.isPinned));
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.conversations = state.conversations.filter((item) => item._id !== action.payload);
        if (state.activeConversationId === action.payload) {
          state.activeConversationId = null;
          state.messages = [];
        }
      })
      .addCase(deleteConversation.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  setActiveConversation,
  startNewChat,
  setSearch,
  clearChatError,
  streamStarted,
  streamChunkReceived,
} =
  chatSlice.actions;
export default chatSlice.reducer;
