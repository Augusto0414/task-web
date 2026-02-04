import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../api/axios";
import { getApiErrorMessage } from "../../api/errors";
import type { AuthState, LoginPayload, RegisterPayload } from "./types";

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  status: "idle",
  error: null,
};

export const registerUser = createAsyncThunk<unknown, RegisterPayload, { rejectValue: string }>(
  "auth/register",
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/register", payload);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error, "Error al registrar"));
    }
  },
);

export const loginUser = createAsyncThunk<{ token?: string }, LoginPayload, { rejectValue: string }>(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/login", payload);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error, "Error al iniciar sesión"));
    }
  },
);

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.post("/logout");
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error, "Error al cerrar sesión"));
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      state.error = null;
      if (action.payload) {
        localStorage.setItem("token", action.payload);
      } else {
        localStorage.removeItem("token");
      }
    },
    logout(state) {
      state.token = null;
      state.error = null;
      state.status = "idle";
      localStorage.removeItem("token");
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = String(action.payload ?? "Error al registrar");
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        const token = action.payload?.token ?? null;
        state.token = token;
        if (token) {
          localStorage.setItem("token", token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = String(action.payload ?? "Error al iniciar sesión");
      });
  },
});

export const { logout, setToken, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
export type { AuthState, LoginPayload, RegisterPayload };

