/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface Note {
  note_id: number;
  user_id: number;
  note_title: string;
  note_content: string;
}

interface NotesState {
  loading: boolean;
  success: boolean;
  notes: Note[] | null;
  singleNote: Note | null;
  error: string | null;
}

const initialState: NotesState = {
  loading: false,
  success: false,
  notes: null,
  singleNote: null,
  error: null,
};

export const getNotes = createAsyncThunk<
  { notes: Note[] },
  number,
  { rejectValue: string }
>("notes/getNotes", async (user_id, { rejectWithValue }) => {
  const token = Cookies.get("token");
  if (!token) return rejectWithValue("ابتدا باید وارد شوید.");

  try {
    const res = await fetch("/api/routes/notes/get-notes/get-all-notes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return { notes: data.notes };
    } else {
      const data = await res.json();
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    return rejectWithValue(err.message || "خطایی رخ داده است.");
  }
});

// Single Note Async Thunk
export const getSingleNote = createAsyncThunk<
  { note: Note },
  number,
  { rejectValue: string }
>("notes/getSingleNote", async (note_id, { rejectWithValue }) => {
  const token = Cookies.get("token");
  if (!token) return rejectWithValue("ابتدا باید وارد شوید");

  try {
    const res = await fetch(
      `/api/routes/notes/get-notes/get-single-note?note_id=${note_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.ok) {
      const data = await res.json();
      return { note: data.note };
    } else {
      const error = await res.json();
      return rejectWithValue(error.message);
    }
  } catch (err: any) {
    return rejectWithValue(err.message || "خطایی رخ داده است.");
  }
});

const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    cleanError: (state) => {
      state.loading = false;
      state.success = false;
      state.notes = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotes.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.notes = null;
        state.error = null;
      })
      .addCase(
        getNotes.fulfilled,
        (state, action: PayloadAction<{ notes: Note[] }>) => {
          state.loading = false;
          state.success = true;
          state.notes = action.payload.notes;
          state.error = null;
        }
      )
      .addCase(
        getNotes.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.success = false;
          state.notes = null;
          state.error = action.payload || "خطایی رخ داده است";
        }
      )
      .addCase(getSingleNote.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.singleNote = null;
        state.error = null;
      })
      .addCase(
        getSingleNote.fulfilled,
        (state, action: PayloadAction<{ note: Note }>) => {
          state.loading = false;
          state.success = true;
          state.singleNote = action.payload.note;
          state.error = null;
        }
      )
      .addCase(
        getSingleNote.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.success = false;
          state.singleNote = null;
          state.error = action.payload || "خطایی رخ داده است";
        }
      );
  },
});

export const { cleanError } = noteSlice.actions;
const notesReducer = noteSlice.reducer;
export default notesReducer;
