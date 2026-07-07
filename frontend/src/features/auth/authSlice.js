import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authService } from "../../services/authService.js";
import { getApiError, setAccessToken } from "../../services/apiClient.js";
import { clearStoredAuth, getStoredAuth, persistAuth } from "../../lib/storage.js";

const storedAuth = getStoredAuth();

export const login = createAsyncThunk("auth/login", async (payload, thunkApi) => {
  try {
    const response = await authService.login(payload);
    const data = response.data.data;
    setAccessToken(data.accessToken);
    persistAuth(data);
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(getApiError(error, "Login failed"));
  }
});

export const register = createAsyncThunk("auth/register", async (payload, thunkApi) => {
  try {
    const response = await authService.register(payload);
    const data = response.data.data;
    setAccessToken(data.accessToken);
    persistAuth(data);
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(getApiError(error, "Registration failed"));
  }
});

export const loadCurrentUser = createAsyncThunk("auth/me", async (_, thunkApi) => {
  try {
    const response = await authService.me();
    return response.data.data;
  } catch (error) {
    return thunkApi.rejectWithValue(getApiError(error, "Session expired"));
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await authService.logout();
  } finally {
    setAccessToken(null);
    clearStoredAuth();
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedAuth.user,
    accessToken: storedAuth.accessToken,
    status: "idle",
    bootstrapped: Boolean(storedAuth.accessToken),
    error: null,
  },
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.bootstrapped = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.bootstrapped = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.bootstrapped = true;
      })
      .addCase(loadCurrentUser.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.bootstrapped = true;
        clearStoredAuth();
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.bootstrapped = true;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
