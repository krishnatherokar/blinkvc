import { AiOutlineLoading } from "react-icons/ai";

export default function Loading() {
  return (
    <section className="flex flex-col justify-center w-full h-screen p-6 pb-40">
      <AiOutlineLoading className="animate-spin h-10 w-10 m-auto" />
    </section>
  );
}
