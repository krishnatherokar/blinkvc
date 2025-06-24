"use client";
import { useToast } from "@/contexts/GlobalToastContext";
import { useUserContext } from "@/contexts/UserContext";
import axios from "axios";
import { useRouter } from "next/navigation";

type userArrayElement = { clerkId: String; username: String };

const page = () => {
  const { user, loading, refreshUser } = useUserContext();
  const { triggerToast, errorToast } = useToast();
  const router = useRouter();

  const unFriend = async (targetId: String) => {
    try {
      triggerToast({
        toastType: "info",
        text: "Unfriending...",
      });
      await axios.post("/api/user/unfriend", { targetId });

      refreshUser();
      triggerToast({ toastType: "success", text: "Unfriended!" });
    } catch (err) {
      errorToast(err);
    }
  };

  const callPeer = (element: userArrayElement) => {
    triggerToast({
      toastType: "info",
      text: `Calling @${element.username}`,
    });
    router.push(`/call?type=call-to&targetId=${element.clerkId}`);
  };

  if (loading) return <>Loading...</>;

  return user.friends.length ? (
    <>
      {user.friends.map((element: userArrayElement, idx: number) => (
        <div key={idx} className="my-2">
          @{element.username}
          <button
            className="px-4 py-2 mx-1 rounded-md bg-blue-500"
            onClick={() => callPeer(element)}
          >
            Call
          </button>
          <button
            className="px-4 py-2 mx-1 rounded-md bg-red-500"
            onClick={() => unFriend(element.clerkId)}
          >
            UnFriend
          </button>
        </div>
      ))}
    </>
  ) : (
    <>No Friends</>
  );
};
export default page;
