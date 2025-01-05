/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface User {
  user_id: number;
  username: string;
  email: string;
  password?: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface LoginState {
  loading: boolean;
  success: boolean;
  user: User | null;
  token: string | null | undefined;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: LoginState = {
  loading: false,
  success: false,
  user: null,
  token: typeof window !== "undefined" ? Cookies.get("token") : null,
  isAuthenticated:
    typeof window !== "undefined" ? !!Cookies.get("token") : false,
  error: null,
};

export const userLogin = createAsyncThunk<
  { user: User },
  { identifier: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async (userData, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/routes/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (res.ok) {
      const data = await res.json();
      return { user: data?.user, token: data?.token } as LoginResponse;
    } else {
      const data = await res.json();
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    return rejectWithValue(
      err.message || "خطایی در مرحله ثبت نام رخ داده است."
    );
  }
});

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    logout: (state) => {
      state.loading = false;
      state.success = false;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      if (typeof window !== "undefined") {
        Cookies.remove("token");
        Cookies.remove("user");
      }
    },
    cleanError(state) {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.token = null;
        state.user = null;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(userLogin.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;

        Cookies.set("token", action.payload.token, { expires: 7 });
        Cookies.set("user", JSON.stringify(action.payload.user), {
          expires: 7,
        });
      })
      .addCase(userLogin.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload || "خطای نامشخص رخ داده است.";
      });
  },
});

export const selectIsAuthenticated = (state: { login: LoginState }) =>
  state.login.isAuthenticated;

export const { logout, cleanError } = loginSlice.actions;
const loginReducer = loginSlice.reducer;
export default loginReducer;
