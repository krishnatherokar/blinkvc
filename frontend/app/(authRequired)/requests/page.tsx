"use client";
import { useToast } from "@/contexts/GlobalToastContext";
import { useUserContext } from "@/contexts/UserContext";
import axios from "axios";

type userArrayElement = { clerkId: String; username: String };

const page = () => {
  const { user, loading, refreshUser } = useUserContext();
  const { triggerToast, errorToast } = useToast();

  const rejectReq = async (targetId: String) => {
    try {
      triggerToast({
        toastType: "info",
        text: "Rejecting request...",
      });
      await axios.post("/api/user/rejectreq", { targetId });

      refreshUser();
      triggerToast({ toastType: "success", text: "Request rejected!" });
    } catch (err) {
      errorToast(err);
    }
  };

  const acceptReq = async (targetId: String) => {
    try {
      triggerToast({
        toastType: "info",
        text: "Accepting request...",
      });
      await axios.post("/api/user/acceptreq", { targetId });

      refreshUser();
      triggerToast({ toastType: "success", text: "Request accepted!" });
    } catch (err) {
      errorToast(err);
    }
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
