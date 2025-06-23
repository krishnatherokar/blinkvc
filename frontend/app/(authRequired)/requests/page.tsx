"use client";
import { useUserContext } from "@/contexts/UserContext";
import axios from "axios";
import { useRef } from "react";

type userArrayElement = { clerkId: String; username: String };

const page = () => {
  const { user, loading } = useUserContext();

  const rejectReq = async (targetId: String) => {
    await axios.post("/api/user/rejectreq", { targetId });
  };

  const acceptReq = async (targetId: String) => {
    await axios.post("/api/user/acceptreq", { targetId });
  };

  if (loading) return <>Loading...</>;

  return user.requests.length ? (
    <>
      {user.requests.map((element: userArrayElement, idx: number) => (
        <div key={idx} className="my-2">
          @{element.username}
          <button
            className="px-4 py-2 mx-1 rounded-md bg-red-500"
            onClick={() => rejectReq(element.clerkId)}
          >
            Reject
          </button>
          <button
            className="px-4 py-2 mx-1 rounded-md bg-blue-500"
            onClick={() => acceptReq(element.clerkId)}
          >
            Accept
          </button>
        </div>
      ))}
    </>
  ) : (
    <>No Requests</>
  );
};
export default page;
