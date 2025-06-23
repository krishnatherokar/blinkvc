"use client";
import { useUserContext } from "@/contexts/UserContext";
import axios from "axios";
import { useRef } from "react";

type userArrayElement = { clerkId: String; username: String };

const page = () => {
  const { user, loading } = useUserContext();
  const inputref = useRef<HTMLInputElement>(null);

  const sendReq = async () => {
    await axios.post("/api/user/sendreq", {
      targetUsername: inputref.current?.value,
    });
  };

  const unsendReq = async (targetId: String) => {
    await axios.post("/api/user/unsendreq", { targetId });
  };

  if (loading) return <>Loading...</>;

  return (
    <>
      <input
        className="rounded-md p-2 border-1 border-gray-500"
        ref={inputref}
        type="text"
        placeholder="@username"
      />
      <button
        className="px-4 py-2 mx-1 my-2 rounded-md bg-blue-500"
        onClick={sendReq}
      >
        Send Request
      </button>
      {user.req_sent.length ? (
        <>
          {user.req_sent.map((element: userArrayElement, idx: number) => (
            <div key={idx} className="my-2">
              @{element.username}
              <button
                className="px-4 py-2 mx-1 rounded-md bg-red-500"
                onClick={() => unsendReq(element.clerkId)}
              >
                Unsend
              </button>
            </div>
          ))}
        </>
      ) : (
        <>No Requests Sent</>
      )}
    </>
  );
};
export default page;
