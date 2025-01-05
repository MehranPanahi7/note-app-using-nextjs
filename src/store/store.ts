import { configureStore } from "@reduxjs/toolkit";
import registerReducer from "./slices/authSlices/registerSlice";
import loginReducer from "./slices/authSlices/loginSlice";
import notesReducer from "./slices/noteSlices/getNotesSlice";

export const store = configureStore({
  reducer: {
    register: registerReducer,
    login: loginReducer,
    notes: notesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
