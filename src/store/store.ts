import { configureStore } from "@reduxjs/toolkit";
import registerReducer from "./slices/authSlices/registerSlice";
import loginReducer from "./slices/authSlices/loginSlice";
import notesReducer from "./slices/noteSlices/getNotesSlice";
import noteActionReducer from "./slices/noteSlices/noteActionSlice";

export const store = configureStore({
  reducer: {
    register: registerReducer,
    login: loginReducer,
    notes: notesReducer,
    noteActions: noteActionReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
