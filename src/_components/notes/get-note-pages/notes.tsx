"use client";
import { getNotes } from "@/store/slices/noteSlices/getNotesSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect } from "react";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Note from "./note";

interface Note {
  note_title: string;
  note_content: string;
}

interface DecodedToken {
  user: {
    user_id: number;
    username: string;
    email: string;
  };
  exp: number;
  iat: number;
}

export default function Notes() {
  const dispatch = useDispatch<AppDispatch>();
  const { error, success, loading, notes } = useSelector(
    (state: RootState) => state.notes
  );

  // Fetch notes when the component is mounted
  useEffect(() => {
    const token = Cookie.get("token");

    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const user_id = decoded.user.user_id;

        dispatch(getNotes(user_id));
      } catch (err) {
        console.error("خطا در دیکود کردن توکن", err);
      }
    } else {
      console.warn("توکن یافت نشد.");
    }
  }, [dispatch]);

  return (
    <div className="flex justify-center items-center p-4 m-2 w-full">
      {loading && <p className="text-blue-500">در حال بارگذاری...</p>}
      {error && (
        <p className="text-red-500">خطا در بارگذاری یادداشت‌ها: {error}</p>
      )}
      {success && notes?.length === 0 && (
        <p className="text-gray-500">هیچ یادداشتی یافت نشد.</p>
      )}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 p-2 w-full md:w-full h-full">
        {notes?.map((note) => (
          <div
            className="flex justify-center items-center p-2"
            key={note.note_id}
          >
            <Note note={note} />
          </div>
        ))}
      </div>
    </div>
  );
}
