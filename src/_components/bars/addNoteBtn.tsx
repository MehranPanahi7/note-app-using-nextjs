"use client";
import { useState } from "react";
import { IoAddSharp } from "react-icons/io5";
import AddNoteForm from "../notes/addNoteForm";

export default function AddNoteBtn() {
  const [btnStatus, setBtnStatus] = useState<boolean>(false);

  const changeBtnStatus = () => setBtnStatus(!btnStatus);

  return (
    <div className="flex justify-center items-center">
      <div className="flex justify-center items-center w-16 h-16 p-2 bg-gray-600 rounded-full">
        <button title="یادداشت جدید" onClick={changeBtnStatus}>
          <IoAddSharp
            size={40}
            className="text-white hover:scale-110 hover:text-green-300 transition-all delay-100"
          />
        </button>
      </div>
      {btnStatus && (
        <div className="fixed top-0 left-0 bg-black bg-opacity-40 w-full md:w-full sm:w-full h-full flex justify-center items-center flex-col p-4">
          <AddNoteForm onClose={changeBtnStatus} />
        </div>
      )}
    </div>
  );
}
