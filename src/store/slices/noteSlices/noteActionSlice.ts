/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import Cookie from "js-cookie";

interface Note {
  note_content: string;
  note_title: string;
}
interface NoteState {
  loading: boolean;
  success: boolean;
  note: Note | null;
  error: string | null;
}

const initialState: NoteState = {
  loading: false,
  success: false,
  note: null,
  error: null,
};

// Adding Note Thunk
export const addNote = createAsyncThunk<
  Note, // نوع داده برگشتی
  Note, // نوع داده ورودی
  { rejectValue: string }
>("note/addNote", async (noteData, { rejectWithValue }) => {
  const token = Cookie.get("token");
  if (!token) return rejectWithValue("ابتدا باید وارد شوید");

  try {
    const res = await fetch("/api/routes/notes/note-actions/add-new-note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(noteData),
    });

    if (res.ok) {
      return await res.json();
    } else {
      const error = await res.json();
      return rejectWithValue(error.message || "خطای سرور.");
    }
  } catch (err: any) {
    return rejectWithValue(err.message || "خطایی رخ داده است.");
  }
});

// Deleting Note Thunk
export const removeNote = createAsyncThunk<
  { note: Note },
  number,
  { rejectValue: string }
>("note/removeNote", async (note_id, { rejectWithValue }) => {
  const token = Cookie.get("token");
  if (!token) return rejectWithValue("ابتدا باید وارد شوید.");
  try {
    const res = await fetch("/api/routes/notes/note-actions/delete-note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(note_id),
    });
    if (res.ok) {
      return await res.json();
    } else {
      const error = await res.json();
      return rejectWithValue(error.message || "خطای سرور رخ داده است.");
    }
  } catch (err: any) {
    return rejectWithValue(err.message || "خطایی رخ داده است.");
  }
});

const noteActionSlice = createSlice({
  name: "noteActions",
  initialState,
  reducers: {
    cleanError: (state) => {
      state.error = null;
      state.loading = false;
      state.success = false;
      state.note = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addNote.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.note = null;
        state.error = null;
      })
      .addCase(addNote.fulfilled, (state, action: PayloadAction<Note>) => {
        state.loading = false;
        state.success = true;
        state.note = action.payload;
        state.error = null;
      })
      .addCase(
        addNote.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.success = false;
          state.note = null;
          state.error = action.payload || "خطایی رخ داده است.";
        }
      )
      .addCase(removeNote.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.note = null;
        state.error = null;
      })
      .addCase(
        removeNote.fulfilled,
        (state, action: PayloadAction<{ note: Note }>) => {
          state.loading = false;
          state.success = true;
          state.note = action.payload.note;
          state.error = null;
        }
      )
      .addCase(
        removeNote.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.success = false;
          state.note = null;
          state.error = action.payload || "خطایی رخ داده است.";
        }
      );
  },
});

export const { cleanError } = noteActionSlice.actions;
const noteActionReducer = noteActionSlice.reducer;
export default noteActionReducer;
