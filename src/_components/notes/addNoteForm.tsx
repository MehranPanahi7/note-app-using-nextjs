"use client";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { addNote } from "@/store/slices/noteSlices/noteActionSlice";
import { useState } from "react";

interface AddNoteFormProps {
  onClose: () => void;
}

interface FormData {
  note_title: string;
  note_content: string;
}

export default function AddNoteForm({ onClose }: AddNoteFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { error, loading } = useSelector(
    (state: RootState) => state.noteActions
  );
  const [formData, setFormData] = useState<FormData>({
    note_title: "",
    note_content: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const resultAction = await dispatch(addNote(formData));
    if (addNote.fulfilled.match(resultAction)) {
      setFormData({ note_content: "", note_title: "" });
      window.location.reload();
    } else {
      console.error(resultAction.payload || "خطایی رخ داده است");
    }
  };
  return (
    <div className="bg-white p-4 m-4 rounded-md shadow-lg w-11/12 md:w-1/2 rtl font-b-nazanin">
      {/* دکمه بستن مودال */}
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="text-gray-700 hover:text-red-500 transition-all"
        >
          <IoClose size={30} />
        </button>
      </div>

      {/* عنوان */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">یادداشت جدید</h1>
      </div>

      {/* فرم */}
      <form className="flex flex-col space-y-4">
        <input
          name="note_title"
          value={formData.note_title}
          onChange={handleChange}
          type="text"
          placeholder="نوشتن موضوعی برای یادداشت"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <textarea
          name="note_content"
          value={formData.note_content}
          onChange={handleChange}
          placeholder="نوشتن متن یادداشت"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        ></textarea>
        <button
          onClick={handleSubmit}
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-all"
        >
          {loading ? "در حال ذخیره‌سازی..." : "ذخیره یادداشت"}
        </button>
        {error && <p className="text-red-500">{error}</p>}{" "}
      </form>
    </div>
  );
}
