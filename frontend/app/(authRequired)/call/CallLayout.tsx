"use client";
import Loading from "@/components/Loading";
import PeopleCard, { NoPeople } from "@/components/PeopleCard";
import StickyTitle from "@/components/StickyTitle";
import { useToast } from "@/contexts/GlobalToastContext";
import { useUserContext } from "@/contexts/UserContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineUserAdd, AiOutlineUserDelete } from "react-icons/ai";
import { LuVideo } from "react-icons/lu";
import { MdArrowBack, MdOutlineAddIcCall } from "react-icons/md";

type userArrayElement = { clerkId: String; username: String };

const CallLayout = () => {
  const [newCallScreen, setNewCallScreen] = useState(false);
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

  const clearMissedCalls = async () => {
    try {
      triggerToast({ toastType: "info", text: "Clearing missed calls..." });
      await axios.post("/api/call/clearmissedcalls");

      refreshUser();
      triggerToast({ toastType: "success", text: "Missed calls cleared!" });
    } catch (err: any) {
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

  if (loading) return <Loading />;

  return (
    <section className="flex">
      {/* Floating button */}
      {!newCallScreen && (
        <button
          onClick={() => setNewCallScreen(true)}
          className="fixed z-4 bottom-20 right-2
          p-3 rounded-lg bg-blue-700 text-white
          sm:hidden"
        >
          <MdOutlineAddIcCall className="h-8 w-8" />
        </button>
      )}

      {/* Missed call section */}
      <section
        className={`${
          newCallScreen ? "hidden" : "block"
        } flex-1 h-screen w-full overflow-y-scroll pb-28 border-neutral-200
        sm:block sm:border-r-1
        dark:border-neutral-800 
      `}
      >
        <StickyTitle>
          Missed Calls
          {user.missed_calls.length ? (
            <>
              <span className="float-start">&emsp;</span>
              <button
                className="float-end font-light text-red-500 text-md"
                onClick={clearMissedCalls}
              >
                Clear All
              </button>
            </>
          ) : null}
        </StickyTitle>
        {user.missed_calls.length ? (
          <>
            {user.missed_calls.map((element: userArrayElement, idx: number) => (
              <PeopleCard key={idx} username={element.username}>
                <LuVideo
                  className="ml-3 h-6 w-6 float-end"
                  onClick={() => callPeer(element)}
                />
              </PeopleCard>
            ))}
          </>
        ) : (
          <NoPeople>No Missed Calls</NoPeople>
        )}
      </section>

      {/* Friends section */}
      <section
        className={`${
          newCallScreen ? "block" : "hidden"
        } flex-1 h-screen w-full overflow-y-scroll pb-28
        sm:block`}
      >
        <StickyTitle>
          <MdArrowBack
            className="h-6 w-6 float-start font-light fill-blue-500
            sm:hidden"
            onClick={() => setNewCallScreen(false)}
          />
          Friends
          <span className="float-end sm:hidden">&emsp;</span>
        </StickyTitle>
        {user.friends.length ? (
          <>
            {user.friends.map((element: userArrayElement, idx: number) => (
              <PeopleCard key={idx} username={element.username}>
                <LuVideo
                  className="ml-3 h-6 w-6 float-end"
                  onClick={() => callPeer(element)}
                />

                <AiOutlineUserDelete
                  className="h-6 w-6 ml-3 float-end fill-red-500"
                  onClick={() => unFriend(element.clerkId)}
                />
              </PeopleCard>
            ))}
          </>
        ) : (
          <NoPeople>
            <div className="flex justify-center">
              No Friends
              <AiOutlineUserAdd
                className="h-6 w-6 fill-blue-500 ml-2"
                onClick={() => router.push("/requests")}
              />
            </div>
          </NoPeople>
        )}
      </section>
    </section>
  );
};

export default CallLayout;
