"use client";
import { useUserContext } from "@/contexts/UserContext";
import axios from "axios";
import Link from "next/link";

type userArrayElement = { clerkId: String; username: String };

const page = () => {
  const { user, loading } = useUserContext();
  const clearMissedCalls = async () => {
    await axios.post("/api/call/clearmissedcalls");
  };

  if (loading) return <>Loading...</>;

  return (
    <>
      <button
        className="px-4 py-2 mx-1 rounded-md bg-red-500"
        onClick={clearMissedCalls}
      >
        Clear All
      </button>
      <br />
      {user.missed_calls.length ? (
        <>
          {user.missed_calls.map((element: userArrayElement, idx: number) => (
            <div key={idx} className="my-2">
              @{element.username}
              <Link
                className="px-4 py-2 mx-1 rounded-md bg-blue-500"
                href={`/call?type=call-to&targetId=${element.clerkId}`}
              >
                Call
              </Link>
            </div>
          ))}
        </>
      ) : (
        <>No Missed Calls</>
      )}
    </>
  );
};
export default page;
