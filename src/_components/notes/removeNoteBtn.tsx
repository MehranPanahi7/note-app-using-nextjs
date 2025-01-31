import { removeNote } from "@/store/slices/noteSlices/noteActionSlice";
import { AppDispatch, RootState } from "@/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa6";

interface Props {
  note_id: number;
}

export default function RemoveNoteBtn({ note_id }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { error, loading } = useSelector(
    (state: RootState) => state.noteActions
  );

  const handleDeleteBtn = () => {
    if (!note_id) {
      console.error("خطا: مقدار note_id نامعتبر است!");
      return;
    }

    const isConfirmed = window.confirm(
      "آیا مطمئن هستید که می‌خواهید این نوت را حذف کنید؟"
    );
    if (isConfirmed) {
      dispatch(removeNote(note_id));
    }
  };

  if (error) return <div>{error}</div>;
  if (loading) return <div>...loading</div>;

  return (
    <div className="flex justify-start items-center p-2">
      <button onClick={handleDeleteBtn} className="text-red-600">
        <FaTrash size={30} />
      </button>
    </div>
  );
}
