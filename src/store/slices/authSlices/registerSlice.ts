/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  username: string;
  email: string;
  password: string;
}

interface RegisterState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: RegisterState = {
  loading: false,
  success: false,
  error: null,
};

export const registerUser = createAsyncThunk<
  { user: User },
  User,
  { rejectValue: string }
>("user/registerUser", async (userData: User, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/routes/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (res.ok) {
      const data = await res.json();
      return { user: data };
    } else {
      const data = await res.json();
      return rejectWithValue(data.message);
    }
  } catch (error: any) {
    return rejectWithValue(
      error.message || "خطایی در مرحله ثبت نام رخ داده است."
    );
  }
});

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "خطایی نامشخص رخ داده است";
      });
  },
});

export const { resetState } = registerSlice.actions;
const registerReducer = registerSlice.reducer;
export default registerReducer;
