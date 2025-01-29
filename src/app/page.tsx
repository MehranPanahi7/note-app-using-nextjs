import AddNoteBtn from "@/_components/bars/addNoteBtn";
import Notes from "@/_components/notes/get-note-pages/notes";

export default function Home() {
  return (
    <div className="w-full flex justify-around items-center p-3 flex-col">
      <div className="flex justify-end items-center w-full flex-col">
        <div className="flex justify-end items-center my-4 w-full p-4">
          <AddNoteBtn />
        </div>
        <div className="flex justify-start items-center my-4 w-full">
          <Notes />
        </div>
      </div>
    </div>
  );
}
