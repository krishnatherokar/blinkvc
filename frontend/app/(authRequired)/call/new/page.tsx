"use client";
import { useUserContext } from "@/contexts/UserContext";
import axios from "axios";
import Link from "next/link";

type userArrayElement = { clerkId: String; username: String };

const page = () => {
  const { user, loading } = useUserContext();

  const unFriend = async (targetId: String) => {
    await axios.post("/api/user/unfriend", { targetId });
  };

  if (loading) return <>Loading...</>;

  return user.friends.length ? (
    <>
      {user.friends.map((element: userArrayElement, idx: number) => (
        <div key={idx} className="my-2">
          @{element.username}
          <Link
            className="px-4 py-2 mx-1 rounded-md bg-blue-500"
            href={`/call?type=call-to&targetId=${element.clerkId}`}
          >
            Call
          </Link>
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
