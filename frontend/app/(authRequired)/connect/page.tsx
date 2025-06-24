"use client";
import { useToast } from "@/contexts/GlobalToastContext";
import { useUserContext } from "@/contexts/UserContext";
import axios from "axios";
import { useRef } from "react";

type userArrayElement = { clerkId: String; username: String };

const page = () => {
  const { user, loading, refreshUser } = useUserContext();
  const inputref = useRef<HTMLInputElement>(null);
  const { triggerToast, errorToast } = useToast();

  const sendReq = async () => {
    try {
      let targetUsername = inputref.current?.value;
      triggerToast({
        toastType: "info",
        text: `Sending friend request to @${targetUsername}`,
      });
      await axios.post("/api/user/sendreq", {
        targetUsername,
      });

      refreshUser();
      triggerToast({ toastType: "success", text: "Request sent!" });
    } catch (err) {
      errorToast(err);
    }
  };

  const unsendReq = async (targetId: String) => {
    try {
      triggerToast({
        toastType: "info",
        text: "Unsending request...",
      });
      await axios.post("/api/user/unsendreq", { targetId });

      refreshUser();
      triggerToast({ toastType: "success", text: "Request unsent!" });
    } catch (err) {
      errorToast(err);
    }
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
