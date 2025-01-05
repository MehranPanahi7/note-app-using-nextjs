import { ClockLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex justify-center items-center p-3 m-4">
      <ClockLoader size={35} />
    </div>
  );
}
