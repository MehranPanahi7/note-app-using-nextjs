import React from "react";

interface NoteProps {
  note: {
    note_id: number;
    note_title: string;
    note_content: string;
  };
}

export default function Note({ note }: NoteProps) {
  return (
    <div className="flex justify-center items-center flex-col p-4 bg-blue-400 w-full md:w-full h-full rounded-md">
      <div className="flex justify-end items-center p-4 bg-orange-300 w-full rounded-lg my-3">
        <h2 className="text-2xl font-bold">{note.note_title}</h2>
      </div>
      <div className="flex justify-end items-center p-4 px-6 bg-gray-300 w-full rounded-lg my-3 overflow-hidden">
        <p className="text-center text-xl">{note.note_content}</p>
      </div>
    </div>
  );
}
