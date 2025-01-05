import { MdError } from "react-icons/md";

interface ErrorPros {
  err: string;
}
export default function ErrorComponent({ err }: ErrorPros) {
  return (
    <div className="flex justify-center items-center p-3 m-4">
      <MdError size={50} />
      <p className="text-red-400">{err}</p>
    </div>
  );
}
