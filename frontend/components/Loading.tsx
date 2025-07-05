import { AiOutlineLoading } from "react-icons/ai";

export default function Loading() {
  return (
    <section className="flex flex-col justify-center w-full h-screen p-6 pb-40">
      <AiOutlineLoading className="animate-spin h-10 w-10 m-auto" />
    </section>
  );
}

export function SkeletonCard() {
  return (
    <div className="flex my-4 p-4 mx-auto max-w-80 animate-pulse">
      <div className="h-8 w-8 inline-block justify-center mr-2 rounded-full bg-neutral-100 dark:bg-neutral-900"></div>
      <div className="flex-1">
        <div className="h-3 mb-2 rounded-xs bg-neutral-100 dark:bg-neutral-900"></div>
        <div className="h-3 w-15 rounded-xs bg-neutral-100 dark:bg-neutral-900"></div>
      </div>
    </div>
  );
}
