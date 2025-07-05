"use client";
import { useToast } from "@/contexts/GlobalToastContext";
import { useUserContext } from "@/contexts/UserContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReceivedRequests from "./ReceivedRequests";
import SentRequests from "./SentRequests";

export type userArrayElement = { clerkId: String; username: String };

const page = () => {
  const [sentReqPage, setSentReqPage] = useState(false);
  const { user, loading, refreshUser } = useUserContext();
  const { triggerToast, errorToast, confirm } = useToast();

  const [delayedLoading, setDelayedLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setDelayedLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const sendReq = async (targetUsername: string) => {
    try {
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
      const userChoice = await confirm({
        text: "Are you sure you want to unsend the request?",
        confirmText: "Unsend",
        isRisky: true,
      });

      if (!userChoice) return;

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

  const rejectReq = async (targetId: String) => {
    try {
      const userChoice = await confirm({
        text: "Are you sure you want to reject the request?",
        confirmText: "Reject",
        isRisky: true,
      });

      if (!userChoice) return;

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

  const leftProps = {
    user,
    loading: loading || delayedLoading,
    sendReq,
    setSentReqPage,
    acceptReq,
    rejectReq,
  };
  const rightProps = {
    user,
    loading: loading || delayedLoading,
    unsendReq,
    setSentReqPage,
  };

  return (
    <>
      {/* Mobile section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sentReqPage ? "right" : "left"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="sm:hidden"
        >
          {sentReqPage ? (
            <SentRequests {...rightProps} />
          ) : (
            <ReceivedRequests {...leftProps} />
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
        <ReceivedRequests {...leftProps} />
        <SentRequests {...rightProps} />
      </motion.div>
    </>
  );
};

export default page;
