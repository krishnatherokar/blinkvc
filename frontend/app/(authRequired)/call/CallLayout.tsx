"use client";
import { useToast } from "@/contexts/GlobalToastContext";
import { useUserContext } from "@/contexts/UserContext";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdOutlineAddIcCall } from "react-icons/md";
import FriendsList from "./FriendList";
import MissedCalls from "./MissedCalls";

type userArrayElement = { clerkId: String; username: String };

const CallLayout = () => {
  const [newCallScreen, setNewCallScreen] = useState(false);
  const { user, loading, refreshUser } = useUserContext();
  const { triggerToast, errorToast, confirm } = useToast();
  const router = useRouter();

  const [delayedLoading, setDelayedLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setDelayedLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const unFriend = async (element: userArrayElement) => {
    try {
      const userChoice = await confirm({
        text: `Are you sure you want to unfriend @${element.username}?`,
        confirmText: "Unfriend",
        isRisky: true,
      });

      if (!userChoice) return;

      triggerToast({
        toastType: "info",
        text: "Unfriending...",
      });
      await axios.post("/api/user/unfriend", { targetId: element.clerkId });

      refreshUser();
      triggerToast({ toastType: "success", text: "Unfriended!" });
    } catch (err) {
      errorToast(err);
    }
  };

  const clearMissedCalls = async () => {
    try {
      const userChoice = await confirm({
        text: `Are you sure you want to clear all the missed calls?`,
        confirmText: "Clear",
        isRisky: true,
      });

      if (!userChoice) return;

      triggerToast({ toastType: "info", text: "Clearing missed calls..." });
      await axios.post("/api/call/clearmissedcalls");

      refreshUser();
      triggerToast({ toastType: "success", text: "Missed calls cleared!" });
    } catch (err: any) {
      errorToast(err);
    }
  };

  const callPeer = async (element: userArrayElement) => {
    const userChoice = await confirm({
      text: `Start video call with @${element.username}?`,
      confirmText: "Call",
    });

    if (!userChoice) return;

    triggerToast({
      toastType: "info",
      text: `Calling @${element.username}`,
    });
    router.push(`/call?type=call-to&targetId=${element.clerkId}`);
  };

  const MissedCallProps = {
    user,
    loading: loading || delayedLoading,
    callPeer,
    clearMissedCalls,
  };
  const FriendListProps = {
    user,
    loading: loading || delayedLoading,
    callPeer,
    unFriend,
    setNewCallScreen,
  };

  return (
    <section>
      {/* Floating button */}
      {!newCallScreen && (
        <button
          onClick={() => setNewCallScreen(true)}
          className="fixed z-4 bottom-20 right-2
          p-4 rounded-2xl bg-blue-600 text-white
          sm:hidden"
        >
          <MdOutlineAddIcCall className="h-8 w-8" />
        </button>
      )}

      {/* Mobile section */}

      <AnimatePresence mode="wait">
        <motion.div
          key={newCallScreen ? 0 : 1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="sm:hidden"
        >
          {newCallScreen ? (
            <FriendsList {...FriendListProps} />
          ) : (
            <MissedCalls {...MissedCallProps} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Desktop section */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="hidden sm:flex"
      >
        <MissedCalls {...MissedCallProps} />
        <FriendsList {...FriendListProps} />
      </motion.div>
    </section>
  );
};

export default CallLayout;
