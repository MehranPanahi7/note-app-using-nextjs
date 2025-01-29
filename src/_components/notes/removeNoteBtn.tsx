import { removeNote } from "@/store/slices/noteSlices/noteActionSlice";
import { AppDispatch, RootState } from "@/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function RemoveNoteBtn() {
  const dispatch = useDispatch<AppDispatch>();
  const { error, loading, success } = useSelector(
    (state: RootState) => state.noteActions
  );
  const note_id = 1;

  const handleDeleteBtn = () => {
    dispatch(removeNote(note_id));
  };

  return <div>removeNoteBtn</div>;
}
